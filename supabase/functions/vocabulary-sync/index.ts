
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configure Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Process the content of a vocabulary CSV file and sync it to the database
 */
async function processVocabularyCSV(fileUrl: string, category: string) {
  try {
    // 1. Download the CSV content
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    // 2. Parse CSV data
    // Simple CSV parser (for more complex needs, a real CSV parser would be better)
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    // Find column indexes
    const originalIndex = headers.findIndex(h => 
      h.trim().toLowerCase() === 'motoriginal' || h.trim().toLowerCase() === '"motoriginal"');
    const improvedIndex = headers.findIndex(h => 
      h.trim().toLowerCase() === 'motameliore' || h.trim().toLowerCase() === '"motameliore"');
    const reasonIndex = headers.findIndex(h => 
      h.trim().toLowerCase() === 'raison' || h.trim().toLowerCase() === '"raison"');
    const levelIndex = headers.findIndex(h => 
      h.trim().toLowerCase() === 'niveau' || h.trim().toLowerCase() === '"niveau"');
      
    if (originalIndex === -1 || improvedIndex === -1 || reasonIndex === -1) {
      throw new Error('CSV format is incorrect. Required columns are missing.');
    }
    
    // 3. Process and insert data
    const entries = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',');
      
      // Clean up values and handle quoted values
      const cleanValue = (val: string) => {
        return val ? val.trim().replace(/^"|"$/g, '') : '';
      };
      
      const entry = {
        mot_original: cleanValue(values[originalIndex]),
        mot_ameliore: cleanValue(values[improvedIndex]),
        raison: cleanValue(values[reasonIndex]),
        categorie: category,
        niveau: levelIndex !== -1 ? cleanValue(values[levelIndex]) : 'courant',
        exemple_utilisation: null
      };
      
      if (entry.mot_original && entry.mot_ameliore) {
        entries.push(entry);
      }
    }
    
    if (entries.length === 0) {
      return { success: false, message: 'No valid entries found in CSV file' };
    }
    
    // 4. Insert data into the database
    // First, check for existing entries to avoid duplicates
    const uniqueEntries = [];
    
    for (const entry of entries) {
      const { data, error } = await supabase
        .from('mots_ameliores')
        .select('id')
        .eq('mot_original', entry.mot_original)
        .eq('mot_ameliore', entry.mot_ameliore)
        .maybeSingle();
        
      if (error) {
        console.error('Error checking for existing entry:', error);
        continue;
      }
      
      if (!data) {
        uniqueEntries.push(entry);
      }
    }
    
    if (uniqueEntries.length === 0) {
      return { success: true, message: 'All entries already exist in database', added: 0 };
    }
    
    // Insert new entries in batches
    const batchSize = 100;
    const batches = [];
    
    for (let i = 0; i < uniqueEntries.length; i += batchSize) {
      batches.push(uniqueEntries.slice(i, i + batchSize));
    }
    
    let totalAdded = 0;
    
    for (const batch of batches) {
      const { data, error } = await supabase
        .from('mots_ameliores')
        .insert(batch);
        
      if (error) {
        console.error('Error inserting vocabulary entries:', error);
      } else {
        totalAdded += batch.length;
      }
    }
    
    return { 
      success: true, 
      message: `Successfully processed vocabulary file`, 
      added: totalAdded,
      total: entries.length
    };
  } catch (error) {
    console.error('Error processing vocabulary CSV:', error);
    return { success: false, message: error.message };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { fileUrl, category = 'général' } = await req.json();
    
    if (!fileUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'No file URL provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const result = await processVocabularyCSV(fileUrl, category);
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in vocabulary-sync function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
