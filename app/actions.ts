"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/client";
import { createAdminClient } from "@/lib/supabase/admin";

const supabase = createClient()
const supabaseAdmin = createAdminClient();


export async function getNames() {
  // actions.ts (the public getNames)
  const { data } = await supabase
    .from('nicknames')
    .select('id, nickname, publisher, likes, created_at, status')
    .eq('status', 'published')
    .order('likes', { ascending: false })
    .limit(20);

  return data ?? [];
}   


export async function getSearchResult(keyword: string) {
  const { data } = await supabase
    .from('nicknames')
    .select('id, nickname, publisher, likes, created_at, status')
    .eq('status', 'published')
    .ilike('nickname', `%${keyword}%`)
    .limit(50);  
  
  return data ?? [];
}

export async function setNames(nickname: string, publisherName: string, publisherEmail: string) {
  const settings = await getSettings();

  if (settings?.accept_submissions !== true) {
    return { success: false, message: "Name submissions are currently closed." };
  }

  // Check if this email submitted recently
  const { data: lastSubmission } = await supabaseAdmin
    .from("nicknames")
    .select("created_at")
    .eq("publisher_email", publisherEmail)
    .order("created_at", { ascending: false })
    .limit(1);

  if (lastSubmission?.[0]) {
    const elapsed = Date.now() - new Date(lastSubmission[0].created_at).getTime();
    const MIN_INTERVAL = 60 * 1000; // 1 minute

    if (elapsed < MIN_INTERVAL) {
      return { success: false, message: "Rate Limit: Please wait 1 minute before submitting again." };
    }
  }

  const { error } = await supabase
    .from("nicknames")
    .insert({
      nickname,
      publisher: publisherName,
      publisher_email: publisherEmail,
      status: "pending",
      likes: 0,
    });

  if (error) return { success: false, message: error.message };
  return { success: true };
}   


//admin
export async function getTotalNames() {
  const { count, error } = await supabaseAdmin
    .from("nicknames")
    .select("*", { count: "exact", head: true });

  if (error) return 0; 
  return count ?? 0;
}   


export async function getPendingNames() {
  const { data } = await supabaseAdmin
    .from("nicknames")
    .select("*")
    .eq("status", "pending") 
    .order("created_at", { ascending: true });

  return data ?? [];
}

export async function getPublishedNames() {
  const { data } = await supabaseAdmin
    .from("nicknames")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function publishName(id: number) {
  const { error } = await supabaseAdmin
    .from("nicknames")
    .update({ status: "published" })
    .eq("id", id);

  if (error) return { success: false, message: error.message };
  revalidatePath("/");
  revalidatePath("/protected");
  return { success: true };
}

export async function deleteName(id: number) {
  const { error } = await supabaseAdmin
    .from("nicknames")
    .delete()
    .eq("id", id);

  if (error) return { success: false, message: error.message };
  revalidatePath("/");
  revalidatePath("/protected");
  return { success: true };
}

export async function updateNameLikes(id: number, likes: number) {
  if (!Number.isInteger(likes) || likes < 0) {
    return { success: false, message: "Likes must be a whole number greater than or equal to zero." };
  }

  const { error } = await supabaseAdmin
    .from("nicknames")
    .update({ likes })
    .eq("id", id);

  if (error) return { success: false, message: error.message };
  revalidatePath("/");
  revalidatePath("/protected");
  return { success: true };
}


export async function updateSettings(key: string, value: boolean) {
  const { error } = await supabaseAdmin
    .from("settings")
    .update({ [key]: value })
    .eq("id", 1);

  if (error) {
    console.error("updateSettings error:", error); 
    return { success: false, message: error.message };
  }

  return { success: true };
}   


export async function getSettings() {
  const { data, error } = await supabase 
    .from("settings")
    .select("*")
    .limit(1)
  if (error) return null;
  return data[0] ?? null;
}