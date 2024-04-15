// plugins/inputValidation.js
export default function () {
  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList' || mutation.type === 'subtree') {
        const elements = document.getElementsByTagName("INPUT");
        for (let i = 0; i < elements.length; i++) {
          elements[i].oninvalid = function(e) {
            const input = e.target;
            if (input.type === 'number') {
              const value = parseFloat(input.value);
              if (isNaN(value) || (input.min !== '' && value < parseFloat(input.min))) {
                input.setCustomValidity(`عدد وارد شده باید بزرگتر از ${input.min} باشد`);
              } else if (input.max !== '' && value > parseFloat(input.max)) {
                input.setCustomValidity(`عدد وارد شده باید کوچکتر از ${input.max} باشد`);
              } else {
                input.setCustomValidity("این فیلد ضروری است");
              }
            } else if (!input.value.trim()) { // Check if input value is empty or contains only whitespace
              input.setCustomValidity("این فیلد ضروری است");
            } else {
              input.setCustomValidity("");
            }
          };
          elements[i].oninput = function(e) {
            e.target.setCustomValidity("");
          };
        }
      }
    }
  });

  observer.observe(document.body, { subtree: true, childList: true });
};
