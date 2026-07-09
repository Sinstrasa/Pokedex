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
            <section>
              <button class="default_sprite" id="defaultSprite" onclick="defSprite(${index})">Default</button>
              <button class="shiny_sprite" id="shinySprite" onclick="shySprite(${index})">Shiny</button>
            </section>
            <section id="dialogMain">
              <div id="dialogPokémonSprite"><img src="${sprite}" alt="Default ${name}"></div>
              <div>
                <p>#${index}</p>
                <p>${name}</p>
                <div id="dialogTypes">
                  <p>typ 1</p>
                  <p>typ 2</p>
                </div>
              </div>
            </section>
            <section>
              <button class="tab" id="generalTab">General</button>
              <button class="tab" id="statsTab">Stats</button>
              <button class="tab" id="abilitesTab">Abilities</button>
            </section>
            <section class="information" id="informationTab"></section>
            `;
}
