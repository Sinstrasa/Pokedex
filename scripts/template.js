function pokémonCardtemplate(index, sprite, name, id) {
  return `
        <button class="pokémon" id="card${+index}" data-id="card" onclick="openDialog(${index})">
            <p>#${id}</p>
            <section class="sprite_n_types">
                <div class="sprites" data-id="card-image"><img src="${sprite}" alt="Picture of Pokémon Nr. ${index}"></div>
                <div class="all_types" id="allTypes${+index}"></div>
            </section>
            <p>${name}</p>
        </button>
        `;
}

function dialogCardTemplate(index, sprite, name, id) {
  return `
          <section class="sprite_buttons">
            <button id="defaultSprite" onclick="showSprite(${index}, ${id}, 'default_sprite')">Default</button>
            <button id="shinySprite" onclick="showSprite(${index}, ${id}, 'shiny_sprite')">Shiny</button>
          </section>
          <section class="dialog_main" id="dialogMain">
            <div id="dialogPokémonSprite" data-id="dialog-image"><img src="${sprite}" alt="Default ${name}"></div>
            <div data-id="overlay-pokemon-name" class="index_name_type">
              <p>#${id}</p>
              <p>${name}</p>
              <div class="all_types" id="dialogTypes"></div>
            </div>
          </section>
          <section class="information_tabs">
            <button class="tab" id="generalTab" onclick="dialogGeneral(${index})">General</button>
            <button class="tab" id="statsTab" onclick="dialogStats(${index})">Stats</button>
            <button class="tab" id="abilitesTab" onclick="dialogAbilities(${index})">Abilities</button>
          </section>
          <section class="information" id="informationTab"></section>
          <section class="switch_id">
            <button class="arrow_left" id="left" data-id="prev-button" onclick="isSearchFunction(${index}, ${false}, ${isSearch}), getFocus('left')">
              <img src="assets/icons/arrow_red.svg" alt="Arrow points left">
            </button>
            <button data-id="close-dialog-button" class="close" onclick="closeDialog()">
              <p>X</p>
            </button>
            <button class="arrow_right" id="right" data-id="next-button" onclick="isSearchFunction(${index}, ${true}, ${isSearch}), getFocus('right')">
              <img src="assets/icons/arrow_red.svg" alt="Arrow points right">
            </button>
          </section>
          `;
}
