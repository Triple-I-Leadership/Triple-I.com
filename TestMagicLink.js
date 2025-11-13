import supabase from "./supabase.js";

async function sendMagicLink(email) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin } // optional
    });
  
    if (error) {
      console.error('sendMagicLink error', error);
      alert('Failed to send test email: ' + error.message);
    } else {
      console.log('Magic/OTP email request accepted', data);
      alert('Test email triggered — check your inbox.');
    }
  }
  
  // usage
  sendMagicLink('urloudgamer@gmail.com');
  