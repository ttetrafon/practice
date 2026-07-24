const fetchData = (baseUrl) => (endpoint) => async (params) => {
  const url = new URL(`${baseUrl}/${endpoint}`);
  Object.keys.params.forEach(key => {url.searchParams.append(key, params[key])});
  const response = await fetch(url);
  return response.json();
};

const shopClient = fetchData("https://api.example.com");

const getShopUserData = shopClient("users");
const getShopProductData = shopClient("products");

(async() => {
  const user = await getShopUserData({id: 12345});
  const product = await getShopProductData({category: "electronics"});
});
