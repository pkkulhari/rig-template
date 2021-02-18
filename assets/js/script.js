/*
*   Content - 
    1. Load Files
    2. Notify Boxes
    3. Pop Up Box
*/


/*------------------------------------------------------------------------
    1. Load Files
-------------------------------------------------------------------------*/
// toggle.js
load('assets/js/toggle.js');

// sidebar.js
load('assets/js/sidebar.js');

// force-desktop.js
load('assets/js/force-desktop.js');

/*<--- HELPERS FUNCTIONS --->*/
function load(src) {
    document.writeln("<script src='" + src + "'></script>");
}


/*------------------------------------------------------------------------
    2. Notify Boxes
-------------------------------------------------------------------------*/
function createNotify(el_parent, msg, msgType = 'info') {
    const div = document.createElement('div');
    const span = document.createElement('span');
    const i = document.createElement('i');

    div.classList.add('notify');
    div.classList.add('notify-' + msgType);

    span.textContent = msg;

    i.classList.add('icon-times');
    i.addEventListener('click', closeNotify);

    div.appendChild(span);
    div.appendChild(i);

    el_parent.prepend(div);
}

function closeNotify(e) {
    e.target.parentNode.remove();
}


/*------------------------------------------------------------------------
    3. Pop Up Box
-------------------------------------------------------------------------*/
document.querySelectorAll('.pop-up-box-close').forEach( (e) => {
    e.addEventListener('click', () => {
        document.querySelectorAll('.pop-up-box').forEach((e) => {
            e.classList.remove('show');
        });
    });
});

/*----- Close All Pop-Box on click event of .pop-up-box -----*/
document.querySelectorAll('.pop-up-box').forEach((e) => {
    e.onclick = (e) => {
        if (e.target.closest('div.inner')) return;
        document.querySelectorAll('.pop-up-box').forEach((e) => {
            e.classList.remove('show');
        });
    }
});
