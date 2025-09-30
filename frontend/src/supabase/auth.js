import supabase from './supabase';
import { useState, useEffect } from 'react';

export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    } catch (err) {
        return { data: null, error: { message: err.message } };
    }
}

export async function signInWithProvider(provider) {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: window.location.origin } 
        });
        return { data, error };
    } catch (err) {
        return { data: null, error: { message: err.message } };
    }
}


export async function signUp(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        return { data, error };
    } catch (err) {
        return { data: null, error: { message: err.message } };
    }
}

export async function signOut(){
    const {error} = await supabase.auth.signOut();
    if(error) console.error("Error signing out : ", error.message);
    return {error};
}   

export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
}

export async function getUser(){
    const {data, error} = await supabase.auth.getUser();
    if(error) console.error("Error fetching user : ", error.message);
    return {data, error};
}

