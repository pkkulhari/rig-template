function autocomplete(el_input, data_array) {
    const el_autocomplete_items = el_input.nextElementSibling;
    
        el_autocomplete_items.classList.add('show');

        const value = el_input.value;
        el_autocomplete_items.innerHTML = '';

        const suggestions = data_array.filter((e) => {
            return e.name.toLowerCase().startsWith(value.toLowerCase());
        });

        suggestions.forEach((suggested) => {
            let b = document.createElement('div');
            b.setAttribute('tabindex', '-1');           
            b.textContent = suggested.name;
            b.addEventListener('click', (e) => {
                el_input.value = e.target.innerHTML;
                el_autocomplete_items.classList.remove('show');
            });
            el_autocomplete_items.appendChild(b);
        });

        if (value == '') {
            el_autocomplete_items.innerHTML = '';
        }
    

    let currentActiveIndex = -1;
    el_input.addEventListener('keydown', (e) => {
        if (e.keyCode == 40) {
            removeActive();
            currentActiveIndex = (currentActiveIndex < el_autocomplete_items.children.length - 1) ? currentActiveIndex + 1 : 0;
            el_autocomplete_items.children[currentActiveIndex].classList.add('active');           
        } else if (e.keyCode == 38) {
            removeActive();
            currentActiveIndex = (currentActiveIndex > 0) ? currentActiveIndex - 1 : el_autocomplete_items.children.length - 1;
            el_autocomplete_items.children[currentActiveIndex].classList.add('active');            
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (el_autocomplete_items.children.length > 0) {
                el_input.value = el_autocomplete_items.children[currentActiveIndex].innerHTML;
            }
            el_autocomplete_items.innerHTML = '';
            currentActiveIndex = -1;
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target != el_input) {
            el_autocomplete_items.innerHTML = '';
        }
    });

    // HELPER FUNCTIONS
    function removeActive() {
        for (let i = 0; i < el_autocomplete_items.children.length; i++) {
            el_autocomplete_items.children[i].classList.remove('active');
        }
    }
}