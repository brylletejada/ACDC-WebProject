const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois",
  "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
  "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

const MAJOR_OPTIONS = [
  { value: "", label: "Choose a major" },
  { value: "informationTechnology", label: "Information Technology" },
  { value: "business", label: "Business" },
  { value: "computerScience", label: "Computer Science" }
];

function fillStateSelect(selectEl, selectedValue = "") {
  if (!selectEl) return;
  selectEl.innerHTML = `<option value="">Select your state</option>` +
    US_STATES.map(state => {
      const selected = state === selectedValue ? " selected" : "";
      return `<option value="${state}"${selected}>${state}</option>`;
    }).join("");
}

function fillMajorSelect(selectEl, selectedValue = "") {
  if (!selectEl) return;
  selectEl.innerHTML = MAJOR_OPTIONS.map(option => {
    const selected = option.value === selectedValue ? " selected" : "";
    return `<option value="${option.value}"${selected}>${option.label}</option>`;
  }).join("");
}
