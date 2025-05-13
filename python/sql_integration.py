
#!/usr/bin/env python3
"""
SQL Database Integration Module for Eloquence App

This script provides functions to interact with the Supabase database
for advanced analysis and reporting on user progress.
"""

import os
import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
OUTPUT_DIR = Path("output")
FIGURES_DIR = Path("output/figures")

def ensure_dirs():
    """Ensure necessary directories exist"""
    OUTPUT_DIR.mkdir(exist_ok=True)
    FIGURES_DIR.mkdir(exist_ok=True)

def get_db_connection():
    """Get a connection to the database"""
    try:
        conn = psycopg2.connect(
            os.getenv("SUPABASE_DB_URL"),
            cursor_factory=RealDictCursor
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

def get_user_progress(user_id):
    """Get progress data for a specific user"""
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        with conn.cursor() as cur:
            # Query to get user's recordings with scores
            cur.execute("""
                SELECT 
                    e.id, 
                    e.created_at, 
                    e.duree, 
                    e.score_eloquence,
                    ae.score_fluidite, 
                    ae.score_vocabulaire, 
                    ae.score_grammaire, 
                    ae.score_rythme
                FROM 
                    enregistrements e
                LEFT JOIN 
                    analyses_eloquence ae ON e.id = ae.enregistrement_id
                WHERE 
                    e.user_id = %s
                ORDER BY 
                    e.created_at
            """, (user_id,))
            
            records = cur.fetchall()
            
            if not records:
                return None
                
            # Convert to DataFrame for easier analysis
            df = pd.DataFrame(records)
            return df
            
    except Exception as e:
        print(f"Error retrieving user progress: {e}")
        return None
    finally:
        conn.close()

def analyze_vocabulary_progress(user_id):
    """Analyze vocabulary improvement over time"""
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        with conn.cursor() as cur:
            # Query to get substitutions across sessions
            cur.execute("""
                SELECT 
                    e.created_at, 
                    ae.substitutions
                FROM 
                    analyses_eloquence ae
                JOIN 
                    enregistrements e ON ae.enregistrement_id = e.id
                WHERE 
                    e.user_id = %s AND 
                    ae.substitutions IS NOT NULL
                ORDER BY 
                    e.created_at
            """, (user_id,))
            
            records = cur.fetchall()
            
            if not records:
                return {
                    "improvement": 0,
                    "frequent_words": [],
                    "vocabulary_level": "débutant"
                }
                
            # Process substitutions data
            all_words = []
            improvement_count = 0
            session_words = {}
            
            for record in records:
                session_date = record["created_at"].strftime("%Y-%m-%d")
                substitutions = record["substitutions"]
                
                if not substitutions:
                    continue
                    
                words_in_session = []
                for sub in substitutions:
                    if "original" in sub and "suggestion" in sub:
                        all_words.append(sub["original"])
                        words_in_session.append(sub["original"])
                        improvement_count += 1
                
                session_words[session_date] = words_in_session
            
            # Find most frequent words
            from collections import Counter
            word_count = Counter(all_words)
            most_frequent = word_count.most_common(5)
            
            # Determine vocabulary level based on number of improvements
            vocab_level = "débutant"
            if improvement_count > 20:
                vocab_level = "intermédiaire"
            if improvement_count > 50:
                vocab_level = "avancé"
            
            return {
                "improvement": improvement_count,
                "frequent_words": most_frequent,
                "vocabulary_level": vocab_level,
                "session_words": session_words
            }
            
    except Exception as e:
        print(f"Error analyzing vocabulary progress: {e}")
        return None
    finally:
        conn.close()

def generate_progress_report(user_id):
    """Generate a comprehensive progress report for a user"""
    ensure_dirs()
    
    # Get user progress data
    progress_data = get_user_progress(user_id)
    if progress_data is None:
        return {
            "success": False,
            "error": "No progress data found for this user"
        }
    
    # Get vocabulary progress
    vocab_progress = analyze_vocabulary_progress(user_id)
    
    # Generate summary statistics
    summary = {
        "total_sessions": len(progress_data),
        "total_duration": progress_data["duree"].sum() if "duree" in progress_data else 0,
        "avg_score": progress_data["score_eloquence"].mean() if "score_eloquence" in progress_data else 0,
        "improvement_rate": calculate_improvement_rate(progress_data) if len(progress_data) > 1 else 0,
        "vocabulary": vocab_progress
    }
    
    # Generate figures if there's enough data
    if len(progress_data) > 1:
        generate_progress_figures(progress_data, user_id)
    
    # Save report to JSON
    report_file = OUTPUT_DIR / f"user_{user_id}_report.json"
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    
    return {
        "success": True,
        "report_path": str(report_file),
        "summary": summary
    }

def calculate_improvement_rate(progress_data):
    """Calculate the rate of improvement across sessions"""
    if "score_eloquence" not in progress_data or len(progress_data) < 2:
        return 0
    
    # Get first and last non-null scores
    scores = progress_data["score_eloquence"].dropna()
    if len(scores) < 2:
        return 0
        
    first_score = scores.iloc[0]
    last_score = scores.iloc[-1]
    
    # Calculate percent improvement
    improvement = ((last_score - first_score) / first_score) * 100
    return round(improvement, 2)

def generate_progress_figures(progress_data, user_id):
    """Generate visualization figures for user progress"""
    # Set Seaborn style
    sns.set_style("whitegrid")
    
    # Figure 1: Overall eloquence score progression
    if "created_at" in progress_data and "score_eloquence" in progress_data:
        plt.figure(figsize=(10, 6))
        valid_data = progress_data[["created_at", "score_eloquence"]].dropna()
        
        if not valid_data.empty:
            sns.lineplot(x="created_at", y="score_eloquence", data=valid_data, marker='o')
            plt.title("Progression du score d'éloquence")
            plt.xlabel("Date")
            plt.ylabel("Score")
            plt.xticks(rotation=45)
            plt.tight_layout()
            plt.savefig(FIGURES_DIR / f"user_{user_id}_overall_progress.png")
            plt.close()
    
    # Figure 2: Metrics comparison
    metrics = ["score_fluidite", "score_vocabulaire", "score_grammaire", "score_rythme"]
    valid_metrics = [m for m in metrics if m in progress_data.columns]
    
    if valid_metrics and len(progress_data) > 1:
        plt.figure(figsize=(12, 7))
        
        # Melt the dataframe to get metrics in long format
        df_melt = pd.melt(
            progress_data[["created_at"] + valid_metrics],
            id_vars=["created_at"],
            value_vars=valid_metrics,
            var_name="Metric",
            value_name="Score"
        )
        
        # Map metric names to French labels
        metric_map = {
            "score_fluidite": "Fluidité",
            "score_vocabulaire": "Vocabulaire",
            "score_grammaire": "Grammaire",
            "score_rythme": "Rythme"
        }
        df_melt["Metric"] = df_melt["Metric"].map(lambda x: metric_map.get(x, x))
        
        sns.lineplot(x="created_at", y="Score", hue="Metric", style="Metric", 
                     markers=True, data=df_melt)
        plt.title("Évolution des métriques d'éloquence")
        plt.xlabel("Date")
        plt.ylabel("Score")
        plt.xticks(rotation=45)
        plt.legend(title="Métrique")
        plt.tight_layout()
        plt.savefig(FIGURES_DIR / f"user_{user_id}_metrics_comparison.png")
        plt.close()

def main():
    if len(os.sys.argv) < 2:
        print("Usage: python sql_integration.py <user_id>")
        return
    
    user_id = os.sys.argv[1]
    result = generate_progress_report(user_id)
    
    if result["success"]:
        print(f"Progress report generated successfully: {result['report_path']}")
        print("\nSummary:")
        print(f"- Total sessions: {result['summary']['total_sessions']}")
        print(f"- Total duration: {result['summary']['total_duration']} seconds")
        print(f"- Average score: {result['summary']['avg_score']:.2f}")
        print(f"- Improvement rate: {result['summary']['improvement_rate']}%")
        print(f"- Vocabulary level: {result['summary']['vocabulary']['vocabulary_level']}")
    else:
        print(f"Error generating report: {result['error']}")

if __name__ == "__main__":
    main()
