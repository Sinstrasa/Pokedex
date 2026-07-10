function pokémonCardtemplate(index, sprite, name) {
  return `
        <button class="pokémon" id="card${+index}" onclick="openDialog(${index})">
            <p>#${index}</p>
            <section class="sprite_n_types">
                <div class="sprites"><img src="${sprite}" alt="Picture of Pokémon Nr. ${index}"></div>
                <div class="all_types" id="allTypes${+index}"></div>
            </section>
            <p>${name}</p>
        </button>
        `;
}

function dialogCardTemplate(index, sprite, name) {
  return `
          <section class="sprite_buttons">
            <button id="defaultSprite" onclick="defSprite(${index})">Default</button>
            <button id="shinySprite" onclick="shySprite(${index})">Shiny</button>
          </section>
          <section class="dialog_main" id="dialogMain">
            <div id="dialogPokémonSprite"><img src="${sprite}" alt="Default ${name}"></div>
            <div class="index_name_type">
              <p>#${index}</p>
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
            <button class="arrow_left" id="left" onclick="switchPokémon(${index}, ${false}), getFocus('left')">
              <img src="assets/icons/arrow_red.svg" alt="Arrow points left">
            </button>
            <button class="close" onclick="closeDialog()">
              <p>X</p>
            </button>
            <button class="arrow_right" id="right" onclick="switchPokémon(${index}, ${true}), getFocus('right')">
              <img src="assets/icons/arrow_red.svg" alt="Arrow points right">
            </button>
          </section>
          `;
}
