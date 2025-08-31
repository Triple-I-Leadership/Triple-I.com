// netlify/functions/supabase.js
exports.handler = async function(event, context) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        url: process.env.SUPABASEURL,
        key: process.env.SUPABASEKEY
      })
    };
  };
  