export async function jsonRequest(url, body) {
  // console.log(`---> request(${url}, ${JSON.stringify(body)})`);
  let headers = {
    "Accept": "*/*",
    "Connection": "keep-alive",
    "Content-Type": "application/json"
  };
  let request = new Request(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
    mode: "cors",
    cache: "no-cache"
  });
  let response = await fetch(request);
  let status = response.status;
  if (status != 200) return null;

  let res = await response.json();
  return res;
}

export async function formDataRequest(url, formData) {
  let request = new Request(url, {
    method: 'POST',
    headers: {
      "Accept": "*/*",
      "Connection": "keep-alive"
    },
    body: formData,
    mode: "cors",
    cache: "no-cache"
  });

  let response = await fetch(request);
  return await response.json();
}