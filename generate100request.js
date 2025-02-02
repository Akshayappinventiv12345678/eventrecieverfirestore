const url = "http://localhost:3000/servergenerate/000test";

(async () => {
  const fetch = (await import('node-fetch')).default; // Dynamic import

  try {
    const res = await fetch(url);
    console.log("Response status:", res.status);
    console.log("Response body:", await res.text());
  } catch (error) {
    console.error("Error while fetching:", error.message);
  }
})();
