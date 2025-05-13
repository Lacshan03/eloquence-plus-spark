
#!/usr/bin/env python3
"""
Vocabulary CSV Generator for Eloquence App

This script generates comprehensive CSV files with vocabulary improvements
organized by category and language register.
"""

import pandas as pd
import numpy as np
import os
from pathlib import Path

# Constants
VOCABULARY_DIR = Path("vocabulaire")
CATEGORIES = [
    "adjectif", 
    "adverbe", 
    "connecteur", 
    "expression", 
    "nom", 
    "verbe"
]

NIVEAUX = ["familier", "courant", "soutenu"]

def ensure_dirs():
    """Ensure necessary directories exist"""
    VOCABULARY_DIR.mkdir(exist_ok=True)

def generate_base_vocabulary():
    """Generate a basic vocabulary improvement CSV file"""
    data = {
        "motOriginal": [
            # Adjectifs
            "bon", "mauvais", "petit", "grand", "joli",
            # Adverbes
            "très", "beaucoup", "bien", "mal", "vraiment",
            # Connecteurs
            "et", "mais", "donc", "ensuite", "parce que",
            # Expressions
            "il y a", "en fait", "c'est-à-dire", "à peu près", "en gros",
            # Noms
            "chose", "truc", "personne", "temps", "problème",
            # Verbes
            "faire", "dire", "aller", "mettre", "voir"
        ],
        "motAmeliore": [
            # Adjectifs améliorés
            "excellent", "déplorable", "minuscule", "imposant", "ravissant",
            # Adverbes améliorés
            "extrêmement", "considérablement", "admirablement", "médiocrement", "effectivement",
            # Connecteurs améliorés
            "ainsi que", "néanmoins", "par conséquent", "ultérieurement", "en raison de",
            # Expressions améliorées
            "il existe", "en réalité", "plus précisément", "approximativement", "globalement",
            # Noms améliorés
            "élément", "objet", "individu", "période", "difficulté",
            # Verbes améliorés
            "accomplir", "exprimer", "se rendre", "installer", "observer"
        ],
        "raison": [
            # Raisons adjectifs
            "Plus précis et expressif", "Plus formel et descriptif", "Plus précis pour une petite taille", 
            "Plus élégant que simplement 'grand'", "Plus recherché que 'joli'",
            # Raisons adverbes
            "Plus soutenu et précis", "Adverbe plus élégant", "Expression plus soignée", 
            "Registre plus soutenu", "Plus formel et précis",
            # Raisons connecteurs
            "Connecteur plus élégant", "Conjonction plus sophistiquée", "Plus formel que 'donc'", 
            "Marque mieux la progression", "Explicitation plus précise",
            # Raisons expressions
            "Formulation plus élégante", "Plus précis et formel", "Expression plus académique", 
            "Plus précis que 'à peu près'", "Registre plus soutenu",
            # Raisons noms
            "Terme plus précis", "Évite le registre familier", "Terme plus formel", 
            "Plus précis que le mot 'temps'", "Désignation plus précise",
            # Raisons verbes
            "Verbe plus précis et expressif", "Plus élégant que 'dire'", "Formulation plus élégante", 
            "Plus précis que 'mettre'", "Verbe plus soutenu"
        ],
        "categorie": [
            # Catégories adjectifs
            "adjectif", "adjectif", "adjectif", "adjectif", "adjectif",
            # Catégories adverbes
            "adverbe", "adverbe", "adverbe", "adverbe", "adverbe",
            # Catégories connecteurs
            "connecteur", "connecteur", "connecteur", "connecteur", "connecteur",
            # Catégories expressions
            "expression", "expression", "expression", "expression", "expression",
            # Catégories noms
            "nom", "nom", "nom", "nom", "nom",
            # Catégories verbes
            "verbe", "verbe", "verbe", "verbe", "verbe"
        ],
        "niveau": [
            # Niveaux adjectifs
            "courant", "courant", "courant", "courant", "courant",
            # Niveaux adverbes
            "soutenu", "soutenu", "courant", "courant", "courant",
            # Niveaux connecteurs
            "courant", "soutenu", "courant", "courant", "courant",
            # Niveaux expressions
            "courant", "courant", "courant", "courant", "courant",
            # Niveaux noms
            "courant", "familier", "courant", "courant", "courant",
            # Niveaux verbes
            "courant", "courant", "courant", "courant", "courant"
        ]
    }
    
    df = pd.DataFrame(data)
    return df

def generate_advanced_vocabulary():
    """Generate a more advanced vocabulary improvement CSV file"""
    data = {
        "motOriginal": [
            # Adjectifs
            "intéressant", "important", "bizarre", "difficile", "simple",
            # Adverbes
            "certainement", "complètement", "évidemment", "généralement", "simplement",
            # Connecteurs
            "cependant", "ainsi", "également", "pourtant", "par ailleurs",
            # Expressions
            "dans le cadre de", "dans une certaine mesure", "à cet égard", 
            "en ce qui concerne", "compte tenu de",
            # Noms
            "domaine", "aspect", "facteur", "changement", "développement",
            # Verbes
            "considérer", "présenter", "démontrer", "établir", "suggérer"
        ],
        "motAmeliore": [
            # Adjectifs améliorés
            "captivant", "crucial", "singulier", "ardu", "rudimentaire",
            # Adverbes améliorés
            "indéniablement", "intégralement", "manifestement", "habituellement", "sommairement",
            # Connecteurs améliorés
            "toutefois", "de ce fait", "de surcroît", "nonobstant", "en outre",
            # Expressions améliorées
            "dans la perspective de", "dans une proportion relative", "relativement à cette question", 
            "quant à", "eu égard à",
            # Noms améliorés
            "champ d'expertise", "facette", "paramètre", "mutation", "évolution",
            # Verbes améliorés
            "analyser", "exposer", "prouver", "instaurer", "préconiser"
        ],
        "raison": [
            # Raisons adjectifs
            "Plus évocateur et précis", "Souligne mieux l'aspect essentiel", "Plus précis que 'bizarre'", 
            "Exprime mieux la complexité", "Plus précis pour une simplification excessive",
            # Raisons adverbes
            "Plus affirmatif et soutenu", "Exprime mieux la totalité", "Plus soutenu", 
            "Plus élégant", "Plus concis",
            # Raisons connecteurs
            "Plus élégant que 'cependant'", "Exprime mieux la conséquence", "Plus soutenu que 'également'", 
            "Plus littéraire", "Connecteur plus élaboré",
            # Raisons expressions
            "Formulation plus recherchée", "Expression plus nuancée", "Tournure plus élégante", 
            "Formule plus concise", "Expression plus soutenue",
            # Raisons noms
            "Expression plus précise", "Terme plus spécifique", "Concept plus scientifique", 
            "Terme plus dynamique", "Notion plus progressive",
            # Raisons verbes
            "Verbe plus analytique", "Action plus descriptive", "Affirme avec plus de force", 
            "Plus institutionnel", "Verbe plus constructif"
        ],
        "categorie": [
            # Catégories adjectifs
            "adjectif", "adjectif", "adjectif", "adjectif", "adjectif",
            # Catégories adverbes
            "adverbe", "adverbe", "adverbe", "adverbe", "adverbe",
            # Catégories connecteurs
            "connecteur", "connecteur", "connecteur", "connecteur", "connecteur",
            # Catégories expressions
            "expression", "expression", "expression", "expression", "expression",
            # Catégories noms
            "nom", "nom", "nom", "nom", "nom",
            # Catégories verbes
            "verbe", "verbe", "verbe", "verbe", "verbe"
        ],
        "niveau": [
            # Niveaux adjectifs
            "soutenu", "courant", "soutenu", "soutenu", "courant",
            # Niveaux adverbes
            "soutenu", "soutenu", "courant", "courant", "courant",
            # Niveaux connecteurs
            "soutenu", "soutenu", "soutenu", "soutenu", "soutenu",
            # Niveaux expressions
            "soutenu", "soutenu", "soutenu", "soutenu", "soutenu",
            # Niveaux noms
            "soutenu", "soutenu", "soutenu", "soutenu", "courant",
            # Niveaux verbes
            "soutenu", "courant", "soutenu", "soutenu", "soutenu"
        ]
    }
    
    df = pd.DataFrame(data)
    return df

def generate_technical_vocabulary():
    """Generate a technical vocabulary improvement CSV file"""
    data = {
        "motOriginal": [
            # Expressions techniques générales
            "faire une analyse", "donner des résultats", "avoir un impact", 
            "faire des recherches", "mettre en œuvre",
            # Expressions techniques business
            "gagner de l'argent", "faire un profit", "faire une réunion", 
            "donner une présentation", "faire un plan",
            # Expressions techniques IT
            "faire un programme", "créer un site web", "réparer un bug", 
            "sauvegarder des données", "faire une mise à jour",
            # Termes scientifiques
            "changement", "méthode", "résultat", "structure", "théorie",
            # Verbes techniques
            "analyser", "tester", "calculer", "mesurer", "vérifier",
            # Adjectifs techniques
            "efficace", "précis", "fiable", "complexe", "optimisé"
        ],
        "motAmeliore": [
            # Expressions techniques améliorées
            "effectuer une analyse", "produire des résultats", "exercer une influence", 
            "mener des recherches", "déployer",
            # Expressions business améliorées
            "générer des revenus", "réaliser une marge bénéficiaire", "organiser une séance de travail", 
            "délivrer une présentation", "élaborer une stratégie",
            # Expressions IT améliorées
            "développer une application", "concevoir une interface web", "corriger une anomalie", 
            "archiver des données", "procéder à une actualisation",
            # Termes scientifiques améliorés
            "mutation", "protocole", "conclusion", "architecture", "postulat",
            # Verbes techniques améliorés
            "décortiquer", "expérimenter", "quantifier", "évaluer", "contrôler",
            # Adjectifs techniques améliorés
            "performant", "rigoureux", "robuste", "sophistiqué", "rationalisé"
        ],
        "raison": [
            # Raisons expressions techniques
            "Verbe plus précis pour le contexte d'analyse", "Formulation plus technique", 
            "Expression plus professionnelle", "Terminologie plus académique", "Terme technique plus précis",
            # Raisons expressions business
            "Terminologie financière plus précise", "Expression comptable appropriée", "Terme plus professionnel", 
            "Verbe plus adapté au contexte formel", "Terme stratégique plus élaboré",
            # Raisons expressions IT
            "Terme technique informatique", "Expression plus précise en développement web", 
            "Terme technique de développement", "Vocabulaire technique de gestion de données", 
            "Expression plus précise en maintenance",
            # Raisons termes scientifiques
            "Terme plus spécialisé désignant un changement", "Terme scientifique plus rigoureux", 
            "Plus précis dans un contexte scientifique", "Terme technique d'ingénierie", 
            "Concept philosophique et scientifique",
            # Raisons verbes techniques
            "Verbe plus analytique", "Terme plus précis en méthodologie", 
            "Verbe scientifique de mesure", "Plus précis pour l'analyse qualitative", 
            "Plus précis pour la vérification",
            # Raisons adjectifs techniques
            "Plus précis pour décrire les performances", "Décrit mieux la précision méthodologique", 
            "Terme technique de fiabilité", "Décrit mieux des systèmes élaborés", 
            "Terme d'optimisation technique"
        ],
        "categorie": [
            # Catégories expressions techniques
            "expression", "expression", "expression", "expression", "expression",
            # Catégories expressions business
            "expression", "expression", "expression", "expression", "expression",
            # Catégories expressions IT
            "expression", "expression", "expression", "expression", "expression",
            # Catégories termes scientifiques
            "nom", "nom", "nom", "nom", "nom",
            # Catégories verbes techniques
            "verbe", "verbe", "verbe", "verbe", "verbe",
            # Catégories adjectifs techniques
            "adjectif", "adjectif", "adjectif", "adjectif", "adjectif"
        ],
        "niveau": [
            # Niveaux expressions techniques
            "courant", "courant", "courant", "courant", "courant",
            # Niveaux expressions business
            "soutenu", "soutenu", "courant", "soutenu", "soutenu",
            # Niveaux expressions IT
            "courant", "courant", "courant", "courant", "soutenu",
            # Niveaux termes scientifiques
            "soutenu", "soutenu", "courant", "soutenu", "soutenu",
            # Niveaux verbes techniques
            "soutenu", "courant", "soutenu", "courant", "courant",
            # Niveaux adjectifs techniques
            "courant", "soutenu", "courant", "courant", "soutenu"
        ]
    }
    
    df = pd.DataFrame(data)
    return df

def main():
    """Generate and save vocabulary CSV files"""
    ensure_dirs()
    
    # Generate base vocabulary
    base_vocab = generate_base_vocabulary()
    base_vocab.to_csv(VOCABULARY_DIR / "vocabulaire_base.csv", index=False)
    print(f"Generated base vocabulary with {len(base_vocab)} entries")
    
    # Generate advanced vocabulary
    advanced_vocab = generate_advanced_vocabulary()
    advanced_vocab.to_csv(VOCABULARY_DIR / "vocabulaire_avance.csv", index=False)
    print(f"Generated advanced vocabulary with {len(advanced_vocab)} entries")
    
    # Generate technical vocabulary
    technical_vocab = generate_technical_vocabulary()
    technical_vocab.to_csv(VOCABULARY_DIR / "vocabulaire_technique.csv", index=False)
    print(f"Generated technical vocabulary with {len(technical_vocab)} entries")
    
    # Generate a combined file
    combined = pd.concat([base_vocab, advanced_vocab, technical_vocab], ignore_index=True)
    combined.to_csv(VOCABULARY_DIR / "vocabulaire_complet.csv", index=False)
    print(f"Generated complete vocabulary with {len(combined)} entries")

if __name__ == "__main__":
    main()
