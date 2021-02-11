/*<--- toggle.js --->*/
var script_toggle = document.createElement('script');
script_toggle.setAttribute('src', 'assets/js/toggle.js');
document.querySelector('body').appendChild(script_toggle);

/*<--- sidebar.js --->*/
var script_sidebar = document.createElement('script');
script_sidebar.setAttribute('src', 'assets/js/sidebar.js');
document.querySelector('body').appendChild(script_sidebar);

/*<--- force-desktop.js --->*/
var script_forceDesktop = document.createElement('script');
script_forceDesktop.setAttribute('src', 'assets/js/force-desktop.js');
document.querySelector('body').appendChild(script_forceDesktop);

/*<--- Notify Boxes --->*/
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

// Pop Up Box
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
