const svgElement = document.getElementById("mySvg");
let currentPlace = document.querySelector(".current-place");
let allPath = document.querySelectorAll(".map path");
const hoverDetails = document.querySelector(".hover-details");
async function fetchStateData(statecode) {
    try {
        const response = await fetch("state_data.json");
        const data = await response.json();
        return data[statecode];
    } catch (error) {
        console.error("Error fetching state data:", error);
        return null;
    }
}
allPath.forEach(element => {
    element.addEventListener("mouseenter", async function(event) {
      const currentState= element.getAttribute("title");
      currentPlace.innerText = currentState;
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      hoverDetails.style.display = "block";
      hoverDetails.style.left = `${mouseX + 10}px`;
      hoverDetails.style.top = `${mouseY + 10}px`;

      const stateInfo = await fetchStateData(currentState);
      const { districts, villages } = stateInfo || { districts: "N/A", villages: "N/A" };
      hoverDetails.innerText = currentState + "\nDistricts: " + districts + "\nVillages: " + villages;
    });

    element.addEventListener("mouseleave", function() {
      hoverDetails.style.display = "none";
    });
  });
  
svgElement.addEventListener("click", function(event) {
    const bbox = event.target.getBBox();
    console.log(event.target);
    const viewBoxX = bbox.x - 10; 
    const viewBoxY = bbox.y - 10; 
    const viewBoxWidth = bbox.width + 20; 
    const viewBoxHeight = bbox.height + 20;

    svgElement.setAttribute("viewBox", `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`);
});

const resetButton = document.getElementById("resetButton");
let originalViewBox = svgElement.getAttribute("viewBox");
resetButton.addEventListener("click", function() {
    svgElement.setAttribute("viewBox", originalViewBox);
  });