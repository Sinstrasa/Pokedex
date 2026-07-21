async function isSearchFunction(index, forward) {
  if (isSearch) {
    await switchPokémonSearch(index, forward);
  } else {
    await switchPokémon(index, forward);
  }
}

function validateSearch() {
  isSearch = true;
  showOverlay();
  let contentRef = document.getElementById("pokéCards");
  contentRef.innerHTML = ``;
  let searchRef = document.getElementById("searchInput").value;
  switch (searchRef.length) {
    case 0:
      isSearch = false;
      placeInMain();
      break;
    case 1:
    case 2:
      contentRef.innerHTML = `<p>Not enough characters! Please search with more than 3 characters.</p>`;
      hideOverlay();
      break;
    default:
      searchPoké(searchRef.toLowerCase());
      break;
  }
}

async function searchPoké(input) {
  let contentRef = document.getElementById("pokéCards");
  idAkku = [];
  for (let index = 0; index < storage.length; index++) {
    for (let subindex = 0; subindex < (await storage[index].name.length); subindex++) {
      let compare = (await storage[index].name).slice(subindex, input.length+subindex);
      if (input == compare) {
        idAkku.push(index);
      }
    }
  }
  if (idAkku.length == 0) {
    contentRef.innerHTML = `<p data-id="not-found">No Pokémon found with these characters.</p>`;
    hideOverlay();
  } else {
    addSearch();
  }
}

async function addSearch() {
  let contentRef = document.getElementById("pokéCards");
  for (let index = 0; index < idAkku.length; index++) {
    let sprite = await getData(idAkku[index], "default_sprite");
    let type = await getData(idAkku[index], "type");
    let name = capitaliseFirstLetter(await getData(idAkku[index], "name"));
    let id = await getData(idAkku[index], "id");
    contentRef.innerHTML += pokémonCardtemplate(idAkku[index], sprite, name, id);
    let allTypes = await getMoreTypes(idAkku[index]);
    bgColor(idAkku[index], type, "card");
  }
  hideOverlay();
}

async function switchPokémonSearch(index, forward) {
  let subindex = await idAkku.indexOf(index);
  if (forward) {
    if (subindex + 1 == idAkku.length) {
      await createDialog(idAkku[0]);
    } else {
      await createDialog(idAkku[subindex + 1]);
    }
  } else {
    if (subindex - 1 < 0) {
      await createDialog(idAkku[idAkku.length - 1]);
    } else {
      await createDialog(idAkku[subindex - 1]);
    }
  }
}
