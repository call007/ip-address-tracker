import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { addTileLayer, validateIp } from "./helpers";
import icon from "../images/icon-location.svg";

const ipForm = document.querySelector(".search-bar__form");
const ipInfo = document.querySelector("#ip");
const locationInfo = document.querySelector("#location");
const timezoneInfo = document.querySelector("#timezone");
const ispInfo = document.querySelector("#isp");

fetch("https://api.ipify.org")
  .then((resp) => resp.text())
  .then(getData);

ipForm.addEventListener("submit", function (e) {
  e.preventDefault();
  getData();
});

let marker;
const map = L.map("map").setView([51.505, -0.09], 3);
const markerIcon = L.icon({
  iconUrl: icon,
  iconsize: [46, 56],
  iconAnchor: [23, 56],
});

addTileLayer(map);

function getData(ip) {
  const apiUrl = new URL(ipForm.action);
  const formData = new FormData(ipForm);

  if (ip) {
    formData.set("ipAddress", ip);
  }

  if (!validateIp(formData.get("ipAddress"))) {
    alert("You have to enter a valid IP address");
    return;
  }

  for (const [key, value] of formData) {
    apiUrl.searchParams.append(key, value);
  }

  fetch(apiUrl)
    .then((resp) => resp.json())
    .then(setInfo);
}

function setInfo(data) {
  const {
    ip,
    location: { country, region, city, timezone, lat, lng },
    isp,
  } = data;

  ipInfo.innerText = ip;
  locationInfo.innerText = `${country} ${region}, ${city}`;
  timezoneInfo.innerText = timezone;
  ispInfo.innerText = isp;

  map.setView([lat, lng], 13);

  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
  }
}
