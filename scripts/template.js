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

function dialogCardTemplate() {
    return  `
            <section>
              <button class="default_sprite" id="defaultSprite">Default</button>
              <button class="shiny_sprite" id="shinySprite">Shiny</button>
            </section>
            <section>
              <img src="" alt="">
              <div>
                <p>id</p>
                <p>name</p>
                <div>
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
            `
}