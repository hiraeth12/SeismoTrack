import { XMLParser } from "fast-xml-parser";

export async function testDemoTsunami(
  warningTsunamiHandler: (info: any) => void
) {
    
    const url = `${import.meta.env.VITE_BMKG_TSUNAMI}?t=${new Date().getTime()}`;
    
    try {
    const response = await fetch(url);
    const data = await response.text();
    const parser = new XMLParser();
    let jObj = parser.parse(data);
    let infos = jObj.alert.info;
    infos = infos.filter((v) => v.wzarea !== undefined);
    const randInfo = infos[Math.floor(Math.random() * infos.length)];
    warningTsunamiHandler(randInfo);
  } catch (error) {
    alert("Failed to load tsunami data: " + error);
    console.error("Error fetching data:", error);
  }
}
