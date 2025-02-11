const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

async function getSecret() {
  const keyVaultName = "kv-almp-np-01"; // Replace with your Key Vault name
  const secretName ="MS-UAT-OS-JAAS-CONFIGURATION"
  //  "99e6aebe-2143-4b47-b9f2-3ddbcd8a24cc"; // Replace with your secret name
  const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;

  // Authentication
  const credential = new DefaultAzureCredential();
  const client = new SecretClient(keyVaultUrl, credential);

  try {
    const secret = await client.getSecret(secretName);
    console.log(`Secret value: ${secret.value}`);
    return secret.value;
  } catch (error) {
    console.error("Error retrieving secret:", error.message);
  }
}

getSecret();
