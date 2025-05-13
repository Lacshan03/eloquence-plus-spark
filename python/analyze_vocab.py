
#!/usr/bin/env python3
"""
Vocabulary Analysis Script for Eloquence App

This script analyzes vocabulary from transcriptions and builds a database
of suggested improvements based on various linguistic features.
"""

import pandas as pd
import spacy
import json
import os
import sys
from pathlib import Path
from collections import Counter

# Load French language model
try:
    nlp = spacy.load("fr_core_news_md")
except OSError:
    print("Downloading French language model...")
    from spacy.cli import download
    download("fr_core_news_md")
    nlp = spacy.load("fr_core_news_md")

# Constants
REGISTERS = {
    "familier": 1,
    "courant": 2,
    "soutenu": 3
}

CATEGORIES = [
    "adjectif", 
    "adverbe", 
    "connecteur", 
    "expression", 
    "nom", 
    "verbe"
]

VOCABULARY_DIR = Path("vocabulaire")
OUTPUT_DIR = Path("output")

def ensure_dirs():
    """Ensure necessary directories exist"""
    VOCABULARY_DIR.mkdir(exist_ok=True)
    OUTPUT_DIR.mkdir(exist_ok=True)

def load_vocabulary():
    """Load all vocabulary CSV files into a single DataFrame"""
    all_data = []
    
    for file in VOCABULARY_DIR.glob("*.csv"):
        try:
            df = pd.read_csv(file)
            all_data.append(df)
        except Exception as e:
            print(f"Error loading {file}: {e}")
    
    if all_data:
        return pd.concat(all_data, ignore_index=True)
    else:
        # Create a default structure if no files exist
        return pd.DataFrame({
            "motOriginal": [],
            "motAmeliore": [],
            "raison": [],
            "categorie": [],
            "niveau": []
        })

def analyze_text(text):
    """Analyze text and identify improvement opportunities"""
    doc = nlp(text)
    
    # Load the vocabulary database
    vocab_df = load_vocabulary()
    
    # Simple word frequency
    words = [token.text.lower() for token in doc if token.is_alpha and not token.is_stop]
    word_freq = Counter(words)
    
    # Find common words that could be improved
    improvements = []
    
    # Simple direct replacements from our vocabulary database
    for word, count in word_freq.items():
        if count > 1:  # Look for repeated words as candidates for improvement
            # Find potential replacements in our vocabulary database
            replacements = vocab_df[vocab_df["motOriginal"].str.lower() == word.lower()]
            
            if not replacements.empty:
                replacement = replacements.iloc[0]
                improvements.append({
                    "original": word,
                    "suggestion": replacement["motAmeliore"],
                    "raison": replacement["raison"]
                })
    
    # Find overused phrases (bigrams/trigrams)
    # This is a simple implementation - more sophisticated NLP could be used
    from nltk.util import ngrams
    
    if len(doc) > 3:
        tokens = [token.text.lower() for token in doc]
        bigrams = list(ngrams(tokens, 2))
        bigram_freq = Counter(bigrams)
        
        for bg, count in bigram_freq.most_common(3):
            if count > 1:
                phrase = " ".join(bg)
                # Check our vocabulary for phrase improvements
                phrase_matches = vocab_df[vocab_df["motOriginal"].str.lower() == phrase.lower()]
                
                if not phrase_matches.empty:
                    replacement = phrase_matches.iloc[0]
                    improvements.append({
                        "original": phrase,
                        "suggestion": replacement["motAmeliore"],
                        "raison": replacement["raison"]
                    })
    
    # Generate simple statistics
    stats = {
        "word_count": len([t for t in doc if not t.is_punct and not t.is_space]),
        "sentence_count": len(list(doc.sents)),
        "unique_words": len(set([t.lemma_ for t in doc if t.is_alpha])),
        "avg_word_length": sum(len(t.text) for t in doc if t.is_alpha) / len([t for t in doc if t.is_alpha]) if len([t for t in doc if t.is_alpha]) > 0 else 0,
    }
    
    return {
        "improvements": improvements,
        "statistics": stats
    }

def enrich_vocabulary_database(text, improvements):
    """Add new vocabulary improvements to the database"""
    vocab_df = load_vocabulary()
    
    new_entries = []
    for improvement in improvements:
        # Check if we already have this improvement
        exists = ((vocab_df["motOriginal"] == improvement["original"]) & 
                 (vocab_df["motAmeliore"] == improvement["suggestion"])).any()
        
        if not exists:
            # Determine category based on POS tagging
            doc = nlp(improvement["original"])
            
            if len(doc) == 0:
                continue
                
            # Simple heuristic for category
            pos = doc[0].pos_
            if pos == "NOUN":
                category = "nom"
            elif pos == "VERB":
                category = "verbe"
            elif pos == "ADJ":
                category = "adjectif"
            elif pos == "ADV":
                category = "adverbe"
            elif len(doc) > 1:
                category = "expression"
            else:
                category = "autre"
            
            new_entry = {
                "motOriginal": improvement["original"],
                "motAmeliore": improvement["suggestion"],
                "raison": improvement["raison"],
                "categorie": category,
                "niveau": "courant"  # Default level
            }
            new_entries.append(new_entry)
    
    if new_entries:
        new_df = pd.DataFrame(new_entries)
        updated_df = pd.concat([vocab_df, new_df], ignore_index=True)
        
        # Save to a new enriched vocabulary file
        timestamp = pd.Timestamp.now().strftime("%Y%m%d")
        updated_df.to_csv(VOCABULARY_DIR / f"vocabulaire_enrichi_{timestamp}.csv", index=False)
        
    return len(new_entries)

def main():
    ensure_dirs()
    
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
        
        if os.path.exists(input_file):
            with open(input_file, 'r', encoding='utf-8') as f:
                text = f.read()
        else:
            text = sys.argv[1]  # Assume direct text input
    else:
        print("Usage: python analyze_vocab.py <text_file_or_direct_text>")
        return
    
    result = analyze_text(text)
    
    # Enrich our vocabulary database with new improvements
    new_entries = enrich_vocabulary_database(text, result["improvements"])
    print(f"Added {new_entries} new vocabulary entries to the database.")
    
    # Output results
    output_file = OUTPUT_DIR / "analysis_result.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"Analysis complete. Results saved to {output_file}")
    print(f"Found {len(result['improvements'])} potential vocabulary improvements.")
    
    # Print statistics
    stats = result["statistics"]
    print("\nText Statistics:")
    print(f"Word count: {stats['word_count']}")
    print(f"Sentence count: {stats['sentence_count']}")
    print(f"Unique words: {stats['unique_words']}")
    print(f"Average word length: {stats['avg_word_length']:.2f}")

if __name__ == "__main__":
    main()
