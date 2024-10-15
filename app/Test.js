const test = async () => {
  const url = EXPO_PUBLIC_URL + "/A?id=5";
  const response = await fetch(url);

  if(response.ok){
    const json = await response.json();
    console.log(json);
  }
};
