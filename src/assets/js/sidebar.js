/*<--- Set top(style) to ul.tree-menu-1 --->*/
let target_offsetTop;
let target;
let main_scrolled;

function _setTop() {
    document.querySelectorAll('#sidebar a.tree').forEach(function (e) {
        if (e.closest('li').querySelector('ul')) {
            e.closest('li').querySelector('ul').style.top = 'unset';
        }
    })

}
_setTop();

function setTop(el) {
    var top = el.getBoundingClientRect().top;
    if (el.closest('li').querySelector('ul.tree-menu-1')) {
        el.closest('li').querySelector('ul.tree-menu-1').style.top = top + 'px';
    }
}

/*<--- Change navbar and logo style when sidebar is shrinked  --->*/
if (document.querySelector('#sidebar').classList.contains('shrinked')) {
    document.querySelector('#sidebar .logo a img').setAttribute('src', 'assets/images/logo-sm.png');
    document.querySelector('#navbar').classList.add('full-nav');
}


/*<--- Bind ul.tree-menu-1 with #sidebar for scrolling --->*/
const main = document.querySelector('#sidebar');

function targetOffsetTop_find() {
    if (document.querySelector('a.tree.active')) {        
        target = document.querySelector('a.tree.active').closest('li').querySelector('ul.tree-menu-1');        
    }
    target_offsetTop = 0;
    if (target) {
        target_offsetTop = target.getBoundingClientRect().top;
    }
    main_scrolled = 0; // To get already scrolled-top of main
}

targetOffsetTop_find();

if (main.classList.contains('shrinked')) {
    main.addEventListener('scroll', scrollTarget);
}

function scrollTarget() {
    var scrollStart = main.scrollTop;

    if (main_scrolled == 0) {
        main_scrolled = scrollStart;
    }

    scrollStart -= main_scrolled; // Correct scroll starting point
    var target_tempTop = target_offsetTop - scrollStart;

    if (target) {
        target.style.top = target_tempTop + 'px';
    }
}