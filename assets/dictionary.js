const wrapper = document.querySelector(".wrapper"),
  searchInput = wrapper.querySelector("input"),
  synonyms = wrapper.querySelector(".synonym .list"),
  volume = wrapper.querySelector(".word i"),
  removeIcon = wrapper.querySelector(".search span"),
  infoText = wrapper.querySelector(".info-text");
let audio; document.getElementById("audio");


volume.addEventListener("click", (e) => {
  if (e.target.nextElementSibling.getAttribute ("src") === "") {
    console.error("No media file found");
  } else{
    audio.play();
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    fetchApi(e.target.value);
  }
});

removeIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  wrapper.classList.remove("active")
  infoText.style.color = "#9a9a9a"
  infoText.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc."
}); 


// fetch api function
// @param {*} word
function fetchApi(word) {
  infoText.style.color = "#000";
  wrapper.classList.remove("active");
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  fetch(url)
    .then((res) => res.json())
    .then((result) => data(result, word))
    .catch(err => console.error(err));
    
}


  // Data Processing Function
  // @param {*} result 
  // @param {*} word 
  // @returns 
 
 function data(result, word) {
  if (result.title) {
    wrapper.querySelector(".word p").innerText = word;
    infoText.innerHTML = `${result.message}`;
    wrapper.querySelector("ul").style.height = "0";
    wrapper.querySelector("ul").style.opacity = 0;
  } else {
    const newDefinition = new Definition(result);
    const newSynonym = new Synonym(result);
    const newExample = new Example(result);

    newDefinition.renderDefinition();
    newExample.renderExample();
    newSynonym.renderSynonyms();
  }
}

class Definition {
  constructor(result) {
    this.result = result;
    this.show();
    this.renderPhonetics();
  }

  show() {
    wrapper.classList.add("active");
    wrapper.querySelector("ul").style.height = "100%";
    wrapper.querySelector("ul").style.opacity = 1;
    wrapper.querySelector(".word p").innerText = this.result[0].word;
  }

  renderPhonetics() {
    let phoneticsText = `Commonly pronounced as ${this.result[0].phonetics[0].text}`;
    let phoneticsAudio = this.result[0].phonetics[this.result[0].phonetics.length - 1].audio;

    wrapper.querySelector(".word span").innerText = phoneticsText;

    if (phoneticsAudio) {
      audio.setAttribute("src", phoneticsAudio);
      volume.style.color = "#942B1F";
    }
  }

  renderDefinition() {
    wrapper.querySelector(".meaning span").innerText = this.result[0].meanings[0].definitions[0].definition;
  }
}

class Synonym {
  constructor(result) {
    this.result_synonyms = result[0].meanings[0].synonyms;
  }

  renderSynonyms() {
    if (this.result_synonyms.length === 0) {
      syns.parentElement.style.display = "none";
    } else {
      syns.parentElement.style.display = "block";
      syns.innerHTML = "";

      for (let i = 0; i < this.result_synonyms.length; i++) {
        let tag = `<span onclick=fetchApi('${this.result_synonyms[i]}')>${this.result_synonyms[i]}</span>`;
        syns.insertAdjacentHTML("beforeend", tag)
      }
    }
  }
}

class Example {
  constructor(result) {
    this.result_example = result[0].meanings[0].definitions[0].example;
  }

  renderExample() {
    if (this.result_example === undefined) {
      wrapper.querySelector(".example").style.display = "none";
    } else {
      wrapper.querySelector(".example span").innerText = this.result_example;
    }
  }
}
