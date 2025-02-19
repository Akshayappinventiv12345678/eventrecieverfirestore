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

const countrybrandMapping = {
  "1": {
    country: "uae",
    country_code: "uae",
    adpCountryCode: "uae",
    brands: [
      {
        brand: "kfc",
        unique_country_brand_id: 3,
      },
      {
        brand: "hrd",
        unique_country_brand_id: 2,
      },
      {
        brand: "phd",
        unique_country_brand_id: 5,
      }
    ],
  },
  "2": {
    country: "baharain",
    country_code: "bah",
    adpCountryCode: "bhr",
    brands: [
      {
        brand: "kfc",
        unique_country_brand_id: 3,
      },
      {
        brand: "hrd",
        unique_country_brand_id: 2,
      },
      {
        brand: "phd",
        unique_country_brand_id: 4,
      },
    ],
  },
  "3": {
    country: "qatar",
    country_code: "qat",
    adpCountryCode: "qat",
    brands: [
      {
        brand: "hrd",
        unique_country_brand_id: 2,
      },
      {
        brand: "kfc",
        unique_country_brand_id: 3,
      },
    ],
  },
  "4": {
    country: "kuwait",
    country_code: "kuw",
    adpCountryCode: "kwt",
    brands: [
      {
        brand: "hrd",
        unique_country_brand_id: 3,
      },
      {
        brand: "kfc",
        unique_country_brand_id: 4,
      },
    ],
  },
  "6": {
    country: "saudiarabia",
    country_code: "ksa",
    adpCountryCode: "ksa",
    brands: [
      {
        brand: "hrd",
        unique_country_brand_id: 3,
      },
      {
        brand: "kfc",
        unique_country_brand_id: 4,
      },
      {
        brand: "phd",
        unique_country_brand_id: 9,
      },
    ],
  },
  "7": {
    country: "egypt",
    country_code: "egy",
    adpCountryCode: "egy",
    brands: [
      {
        brand: "kfc",
        unique_country_brand_id: 1,
      },
      {
        brand: "hrd",
        unique_country_brand_id: 4,
      },
      {
        brand: "phd",
        unique_country_brand_id: 5,
      },
    ],
  },
};

const sourceNames  = {
  uae: {
    kfc: {"sourceNames":["KFCAPP","KFCPWA"],"sourceId":["23","2"]},
    phd: {"sourceNames":["PHDAPP","PHDPWA"],"sourceId":["23","2"]},
    hrd :{"sourceNames":["HRDAPP","HRDPWA"],"sourceId":["23","2"]},
  },
  egypt: {
    kfc:{"sourceNames":["KFCAPP","KFCPWA"],"sourceId":["16,22"]},
    phd: {"sourceNames":["PHDAPP","PHDPWA"],"sourceId":["16","22"]},
    hrd :{"sourceNames":["HRDAPP","HRDPWA"],"sourceId":["16","22"]},
  },
  saudiarabia: { 
    kfc: { "sourceNames": ["KFCPWA","KFCAPP"], "sourceId":["5","72"] } ,
    phd: {"sourceNames":["PHDAPP","PHDPWA"],"sourceId":["5","72"]},
    hrd :{"sourceNames":["HRDAPP","HRDPWA"],"sourceId":["5","72"]},
},
  kuwait: { 
    kfc: {"sourceNames":["KFCAPP","KFCPWA"],"sourceId":["63","29"]},
    hrd :{"sourceNames":["HRDAPP","HRDPWA"],"sourceId":["63","29"]},}
};



function sendMultiCountry(times){
  const countryId=[1,4,6,7]

  let payload= {"countryId":1,"brandId":3,"storeId":"71273712737","storeBSPNumber":"","storeLocationLat":"31.49604722","storeLocationLng":"30.24154722","orderId":"EGY_Feb-04-25-111046-2000005","externalOrderId":"00000000feb187777221202502041110462000005","almpOrderId":"3c15c1a18104184a7fa56ebc2705103614fc8ab6","createdAtTimezone":"2025-02-04T11:10:48Z","plannedDeliveryTimezone":"2025-02-04T11:40:46Z","orderSourceId":16,"almpStatusId":7,"deliveryLocationLat":"30.244957","deliveryLocationLng":"31.490812","posCreatedAtTimezone":"2025-02-04T11:05:46Z","riderLatitude":31.49604722,"riderLongitude":30.24154722,"eta":"7","riderId":"6828","riderName":"driver2_12737","riderPhone":"9885634520","customerName":"customer1_77777221","customerPhone":"1234567890","speed":"1.0","accuracy":"5.0","heading":0,"orderPosId":"11102000005","orderSourceName":"KFCPWA","orderStatusName":"ORDERPICKED","isIntegratedPartner":false,"isOrderOnHold":false,"isClubbedOrder":false,"clubbedOrders":[],"inTransit":true,"isStoreGeoFenceIn":false,"isCustomerGeofenceIn":false,"URL":""}
  // const payload= JSON.stringify(pau);  
  const country=[];
  // sendMessage(payload,10);
  countryId.forEach((countryId)=>{
    let brandconfig=countrybrandMapping[countryId]["brands"];
    let country_code=countrybrandMapping[countryId]["country"]
    
    brandconfig.forEach(({brand,unique_country_brand_id})=>{

      // console.log({brand,unique_country_brand_id})
      // payload=JSON.parse(payload);
      payload["countryId"]=countryId;
      payload["brandId"]=unique_country_brand_id;
      let {sourceNames : sourcenames,sourceId}=sourceNames[country_code][brand]
      payload["orderSourceName"]=sourcenames[0] ||"";
      payload["orderSourceId"]=sourceId[0] ||"";

      console.log(payload,country_code)
      sendMessage(JSON.stringify(payload),1);


    })


  })




}
sendMultiCountry(1);

