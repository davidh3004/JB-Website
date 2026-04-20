import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkStorage() {
  console.log("Checking storage buckets...");
  
  // 1. List buckets
  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
  if (listError) {
    console.error("Failed to list buckets:", listError.message);
    return;
  }
  
  console.log("Available buckets:", buckets.map(b => b.name).join(", "));
  
  const uploadBucket = buckets.find(b => b.name === "uploads");
  if (!uploadBucket) {
    console.error("The 'uploads' bucket does not exist!");
    return;
  }
  
  console.log(`Bucket 'uploads' is public? ${uploadBucket.public}`);

  // Test an upload
  console.log("Testing an upload...");
  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from("uploads")
    .upload("test-file.txt", "Hello World!", { upsert: true });
    
  if (uploadError) {
    console.error("Upload failed:", uploadError.message);
  } else {
    console.log("Upload succeeded!", uploadData);
    const { data: urlData } = supabaseAdmin.storage.from("uploads").getPublicUrl("test-file.txt");
    console.log("Public URL:", urlData.publicUrl);
  }
}

checkStorage();
