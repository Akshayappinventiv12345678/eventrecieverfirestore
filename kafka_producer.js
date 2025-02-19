const { Kafka } = require("kafkajs");
const dotenv = require("dotenv");
// const { DefaultAzureCredential } = require("@azure/identity");
// const { SecretClient } = require("@azure/keyvault-secrets");

dotenv.config();

const keyVaultName = "kv-almp-np-01";
const secretName = "MS-QA-OS-JAAS-CONFIGURATION";
const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;

async function getSecret() {
 return "";
}

function extractKafkaCredentials(configString) {
  const usernameMatch = configString.match(/username=(?:['"])?([\w]+)(?:['"])?/);
  const passwordMatch = configString.match(/password=(?:['"])?([\w+\/=]+)(?:['"])?/);
  return {
    username: usernameMatch ? usernameMatch[1] : null,
    password: passwordMatch ? passwordMatch[1] : null,
  };
}

async function createProducer() {
  const kafkaBroker = process.env.KAFKA_BROKER || "localhost:9092";
  const kafkaTopic = process.env.KAFKA_TOPICS || "topic1";
  const jaasConfig = await getSecret();
  const { username, password } = extractKafkaCredentials(jaasConfig);

  const kafka = new Kafka({
    clientId: "my-kafka-producer",
    brokers: [kafkaBroker],
    ssl: true,
    sasl: {
      mechanism: "plain",
      username: username || "GXO4DXBNTL5I6MEY",
      password: password || "SBkDXpgPrkGgoaBYJlto9HxTQKhrfgXqtdQeSTiFE5PKauKv0yrqdoIdCPgz9URJ",
    },
  });

  const producer = kafka.producer();
  await producer.connect();
  console.log("Kafka Producer connected.");
  return { producer, kafkaTopic };
}

async function sendMessage(message,times=1) {
  const { producer, kafkaTopic } = await createProducer();
  try {


    const pau= {"countryId":1,"brandId":3,"storeId":"71273712737","storeBSPNumber":"","storeLocationLat":"31.49604722","storeLocationLng":"30.24154722","orderId":"EGY_Feb-04-25-111046-2000005","externalOrderId":"00000000feb1377777221202502041110462000005","almpOrderId":"3c15c1a18104184a7fa56ebc2705103614fc8ab6","createdAtTimezone":"2025-02-04T11:10:48Z","plannedDeliveryTimezone":"2025-02-04T11:40:46Z","orderSourceId":16,"almpStatusId":7,"deliveryLocationLat":"30.244957","deliveryLocationLng":"31.490812","posCreatedAtTimezone":"2025-02-04T11:05:46Z","riderLatitude":31.49604722,"riderLongitude":30.24154722,"eta":"7","riderId":"6828","riderName":"driver2_12737","riderPhone":"9885634520","customerName":"customer1_77777221","customerPhone":"1234567890","speed":"1.0","accuracy":"5.0","heading":0,"orderPosId":"11102000005","orderSourceName":"KFCPWA","orderStatusName":"ORDERPICKED","isIntegratedPartner":false,"isOrderOnHold":false,"isClubbedOrder":false,"clubbedOrders":[],"inTransit":true,"isStoreGeoFenceIn":false,"isCustomerGeofenceIn":false,"URL":""}
const payload= JSON.stringify(pau);

// setTimeout(()=>{riderTrackingApi(payload,mockContext)},2000)

    for (i=0;i<times;i++){

      await producer.send({
        topic: kafkaTopic,
        messages: [{ value: message}],
      });
      console.log(`Message sent to ${kafkaTopic}:`, message);
    }
    
    
  } catch (error) {
    console.error("Error sending message:", error);
  } finally {
    await producer.disconnect();
    console.log("Kafka Producer disconnected.",times);
  }
}



const pau= {"countryId":1,"brandId":3,"storeId":"71273712737","storeBSPNumber":"","storeLocationLat":"31.49604722","storeLocationLng":"30.24154722","orderId":"EGY_Feb-04-25-111046-2000005","externalOrderId":"00000000feb187777221202502041110462000005","almpOrderId":"3c15c1a18104184a7fa56ebc2705103614fc8ab6","createdAtTimezone":"2025-02-04T11:10:48Z","plannedDeliveryTimezone":"2025-02-04T11:40:46Z","orderSourceId":16,"almpStatusId":7,"deliveryLocationLat":"30.244957","deliveryLocationLng":"31.490812","posCreatedAtTimezone":"2025-02-04T11:05:46Z","riderLatitude":31.49604722,"riderLongitude":30.24154722,"eta":"7","riderId":"6828","riderName":"driver2_12737","riderPhone":"9885634520","customerName":"customer1_77777221","customerPhone":"1234567890","speed":"1.0","accuracy":"5.0","heading":0,"orderPosId":"11102000005","orderSourceName":"KFCPWA","orderStatusName":"ORDERPICKED","isIntegratedPartner":false,"isOrderOnHold":false,"isClubbedOrder":false,"clubbedOrders":[],"inTransit":true,"isStoreGeoFenceIn":false,"isCustomerGeofenceIn":false,"URL":""}
const payload= JSON.stringify(pau);

sendMessage(payload,10);



