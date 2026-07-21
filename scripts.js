const BASE_URL = "https://pokeapi.co/api/v2/";
const begin = 0;
const end = 20;
let page = 1;
let safe = 0;
let idAkku = [];
let storage = [];
let isSearch = false;
let count = 0;

async function initialise() {
  await defineCount();
  await saveData();
  await placeInMain();
}

async function defineCount() {
  let responseAsJson = await definePath();
  count = responseAsJson.count;
}

async function restrainEnd() {
  safe = end + 20 * (page - 1);
  if (safe > count) {
    safe = count;
  }
}

async function resetPage() {
  isSearch = false;
  document.getElementById("searchInput").value = "";
  await placeInMain();
}

function showOverlay() {
  let overlayRef = document.getElementById("overlay");
  overlayRef.classList.add("overlay_visible");
  toggleButtons(true);
}

function hideOverlay() {
  let overlayRef = document.getElementById("overlay");
  overlayRef.classList.remove("overlay_visible");
  toggleButtons(false);
}

function toggleButtons(isDisabled) {
  document.getElementById("resetButton").disabled = isDisabled;
  document.getElementById("resetButton").classList.toggle("no_hover_effect");
  document.getElementById("searchButton").disabled = isDisabled;
  document.getElementById("searchButton").classList.toggle("no_hover_effect");
  document.getElementById("previous").disabled = isDisabled;
  document.getElementById("previous").classList.toggle("no_hover_effect");
  document.getElementById("next").disabled = isDisabled;
  document.getElementById("next").classList.toggle("no_hover_effect");
}

async function definePath() {
  let response = await fetch(BASE_URL + "pokemon?limit=100000&offset=0");
  return await response.json();
}

async function placeInMain() {
  showOverlay();
  let contentRef = document.getElementById("pokéCards");
  contentRef.innerHTML = ``;
  await restrainEnd();
  await cardMain();
  hideOverlay();
}

async function cardMain() {
  let contentRef = document.getElementById("pokéCards");
  let boundary = 0;
  if (safe == end + 20 * (page - 1)) {
    boundary = end;
  } else {
    boundary = 20 - (end + 20 * (page - 1) - safe);
  }
  for (let index = begin; index < boundary; index++) {
    let subindex = await storage.findIndex((findPage) => findPage.page === page);
    let name = capitaliseFirstLetter(await getData(subindex + index, "name"));
    let id = await getData(subindex + index, "id");
    let sprite = await getData(subindex + index, "default_sprite");
    let type = await getData(subindex + index, "type");
    contentRef.innerHTML += pokémonCardtemplate(subindex + index, sprite, name, id);
    let allTypes = await getMoreTypes(subindex + index);
    bgColor(subindex + index, type, "card");
  }
}

async function saveData() {
  await restrainEnd();
  for (let index = begin + 20 * (page - 1); index < safe; index++) {
    await addToStorage(index);
  }
}

async function addToStorage(index) {
  let responseAsJson = await definePath();
  let temporaryUrl = await fetch(responseAsJson.results[index].url);
  let tempUrl = await temporaryUrl.json();
  let pokéData = {};
  Object.assign(pokéData, {
    page: page,
    name: tempUrl.forms[0].name,
    id: tempUrl.id,
    default_sprite: tempUrl.sprites.other.home.front_default,
    shiny_sprite: tempUrl.sprites.other.home.front_shiny,
    types: tempUrl.types,
    abilities: tempUrl.abilities,
    stats: tempUrl.stats,
    general_attribute: [
      tempUrl.base_experience,
      tempUrl.height,
      tempUrl.weight,
    ],
  });
  await storage.push(pokéData);
}

async function getData(index, path) {
  switch (path) {
    case "type":
      return await storage[index]["types"][0].type.name;
      break;
    default:
      return await storage[index][path];
      break;
  }
}

async function getMoreTypes(index) {
  let typesRef = document.getElementById("allTypes" + index);
  typesRef.innerHTML = ``;
  for (
    let subindex = 0;
    subindex < storage[index]["types"].length;
    subindex++
  ) {
    typesRef.innerHTML += `<p class="types">${await capitaliseFirstLetter(storage[index]["types"][subindex].type.name)}</p>`;
  }
}

async function createDialog(index) {
  let dialogRef = document.getElementById("dialogDesign");
  let sprite = await getData(index, "default_sprite");
  let type = await getData(index, "type");
  let name = capitaliseFirstLetter(await getData(index, "name"));
  let id = await getData(index, "id");
  dialogRef.innerHTML = dialogCardTemplate(index, sprite, name, id);
  let allTypes = dialogGetTypes(index);
  bgColor(index, type, "dialogMain");
  dialogGeneral(index);
}

async function showSprite(index, id, path) {
  let spriteRef = document.getElementById("dialogPokémonSprite");
  let sprite = await getData(index, path);
  spriteRef.innerHTML = `<img src="${sprite}" alt="Sprite #${id}"> `;
}

async function dialogGetTypes(index) {
  let typesRef = document.getElementById("dialogTypes");
  typesRef.innerHTML = ``;
  for (
    let subindex = 0;
    subindex < storage[index]["types"].length;
    subindex++
  ) {
    typesRef.innerHTML += `<p class="types">${await capitaliseFirstLetter(storage[index]["types"][subindex].type.name)}</p>`;
  }
}

async function dialogGeneral(index) {
  let infoRef = document.getElementById("informationTab");
  infoRef.innerHTML = ``;
  let baseXp = storage[index]["general_attribute"][0];
  let height = storage[index]["general_attribute"][1];
  let weight = storage[index]["general_attribute"][2];
  infoRef.innerHTML = ` <p>Base Exp: ${await baseXp}xp</p>
      <p>Height: ${await height}0cm</p>
      <p>Weight: ${await weight}0g</p>`;
}

async function dialogStats(index) {
  let infoRef = document.getElementById("informationTab");
  infoRef.innerHTML = ``;
  for (
    let subindex = 0;
    subindex < storage[index]["stats"].length;
    subindex++
  ) {
    infoRef.innerHTML += `<p>
        ${await capitaliseFirstLetter(await storage[index]["stats"][subindex].stat.name)}:
        ${await storage[index]["stats"][subindex].base_stat}
      </p>`;
  }
}

async function dialogAbilities(index) {
  let infoRef = document.getElementById("informationTab");
  infoRef.innerHTML = ``;
  for (
    let subindex = 0;
    subindex < storage[index]["abilities"].length;
    subindex++
  ) {
    infoRef.innerHTML += `<p>${await capitaliseFirstLetter(await storage[index]["abilities"][subindex].ability.name)}</p>`;
  }
}

async function switchPokémon(index, forward) {
  restrainEnd();
  if (forward) {
    if (index + 1 == safe) {
      createDialog(begin + 20 * (page - 1));
    } else {
      createDialog(index + 1);
    }
  } else {
    if (index - 1 < begin + 20 * (page - 1)) {
      createDialog(safe - 1);
    } else {
      createDialog(index - 1);
    }
  }
}

async function switchPage(forward) {
  showOverlay();
  if (forward) {
    await page++;
    if (page > 68) {
      page = 1;
    }
  } else {
    await page--;
    if (page <= 0) {
      page = 68;
    }
  }
  await showPage();
  await checkStorage();
  await placeInMain();
  hideOverlay();
}

async function checkStorage() {
  if (!(await storage.some((findId) => findId.page === page))) {
    await saveData();
  }
}

function openDialog(index) {
  let dialogRef = document.getElementById("dialog");
  createDialog(index);
  dialogRef.showModal();
  document.body.classList.toggle("dialog_offen");
}

function closeDialog() {
  let dialogRef = document.getElementById("dialog");
  dialogRef.close();
  document.body.classList.toggle("dialog_offen");
}

function stopPropagation(event) {
  event.stopPropagation();
}

function capitaliseFirstLetter(name) {
  return name[0].toUpperCase() + name.slice(1);
}

function getFocus(id) {
  document.getElementById(id).focus();
}

function showPage() {
  let pageRef = document.getElementById("page");
  pageRef.innerHTML = `${page} / 68`;
}

// For administrative purposes only
async function search() {
  let response = await fetch(BASE_URL + "pokemon?limit=100000&offset=0");
  let responseAsJson = await response.json();
  console.log(await responseAsJson.results[0].url);
}
