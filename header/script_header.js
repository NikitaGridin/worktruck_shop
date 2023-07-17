// Cart and Catalog Menu
function getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
}
jQuery(document).ready(function($){
    //if you change this breakpoint in the style.css file (or _layout.scss if you use SASS), don't forget to update this value as well
    var $L = 1200,
        $catalog_menu = $('#catalog-menu'),
        $catalog_menu_body = $('#catalog-menu-body'),
        $catalog_menu_trigger = $('#catalog-menu-trigger'),
        $catalog_menu_trigger2 = $('#catalog-menu-trigger2'),
        $catalog_menu_close = $('#catalog-menu-close'),
        $catalog_menu_back = $('.catalog-menu-back'),
        $cart_trigger = $('#cd-cart-trigger'),
        $lateral_cart = $('#cd-cart'),
        $shadow_layer = $('#cd-shadow-layer');

    //open catalog menu
    $catalog_menu_trigger.on('click', function(event){
        event.preventDefault();
        //close cart panel (if it's open)
        $lateral_cart.removeClass('speed-in');
        toggle_panel_visibility($catalog_menu, $shadow_layer, $('body'));
    });

    //open catalog menu2
    $catalog_menu_trigger2.on('click', function(event){
        event.preventDefault();
        //close cart panel (if it's open)
        $lateral_cart.removeClass('speed-in');
        toggle_panel_visibility($catalog_menu, $shadow_layer, $('body'));
    });

    //close catalog menu
    $catalog_menu_close.on('click', function (event) {
        event.preventDefault()
        toggle_panel_visibility($catalog_menu, $shadow_layer, $('body'));
    })


    //open cart
    $cart_trigger.on('click', function(event){
        event.preventDefault();
        //close lateral menu (if it's open)
        $catalog_menu.removeClass('speed-in');
        toggle_panel_visibility($lateral_cart, $shadow_layer, $('body'));
    });

    //close cart or catalog menu
    $shadow_layer.on('click', function(){
        $shadow_layer.removeClass('is-visible');
        // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
        if( $lateral_cart.hasClass('speed-in') ) {
            $lateral_cart.removeClass('speed-in').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                $('body').removeClass('overflow-hidden');
                $('body').css('padding-right', 0 + 'px')
                $('.header').css('padding-right', 0 + 'px')
            });
            $catalog_menu.removeClass('speed-in');
        } else {
            $catalog_menu.removeClass('speed-in').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                if( !$catalog_menu.hasClass('speed-in') && !$lateral_cart.hasClass('speed-in') ) {
                    $('body').removeClass('overflow-hidden');
                    $('body').css('padding-right', 0 + 'px')
                    $('.header').css('padding-right', 0 + 'px')
                }
            });
            $lateral_cart.removeClass('speed-in');
        }
    });

    //catalog menu list
    var prevPanel = null;
    var currentPanel = $catalog_menu_body.children('.catalog-menu__panel--active')[0]

    if ($catalog_menu && $catalog_menu_body) {
        var catalogMenuItems = $('.catalog-menu__item[data-hasPanel]')
        catalogMenuItems.each(function () {
            var menuItem = $(this)
            var menuItemLink = menuItem.children('a')
            var menuItemPanel = menuItem.children('.catalog-menu__panel')

            if (menuItemPanel.length && menuItemLink.length ) {
                menuItemLink.click(function (e) {
                    e.preventDefault()
                    var clonedPanel = menuItemPanel.clone(true)
                    var catalogMenuWidth = $catalog_menu.width()
                    clonedPanel.appendTo($catalog_menu_body)
                    clonedPanel.css('transform', `translateX(${catalogMenuWidth}px)`)
                    setTimeout(() => {
                        clonedPanel.css('transform', 'translateX(0)')
                    }, 50)

                    prevPanel = currentPanel
                    currentPanel = clonedPanel

                    $(prevPanel).css('transform', 'translateX(0)')
                    setTimeout(() => {
                        $(prevPanel).css('transform', `translateX(-${catalogMenuWidth}px)`)
                    }, 50)

                    $catalog_menu_close.addClass('catalog-menu-close--white')
                })
            }
        })
    }
    //catalog menu back btn
    $catalog_menu_back.on('click', function () {
        var catalogMenuWidth = $catalog_menu.width()
        if (prevPanel) {
            $(currentPanel).css('transform', 'translateX(0)')
            setTimeout(() => {
                $(currentPanel).css('transform', `translateX(${catalogMenuWidth}px)`)
            }, 50)
            $(prevPanel).css('transform', `translateX(-${catalogMenuWidth})`)
            setTimeout(() => {
                $(prevPanel).css('transform', 'translateX(0)')
            }, 50)
            setTimeout(() => {
                currentPanel.remove()
                currentPanel = prevPanel
                if ($(currentPanel).prev().length) {
                    prevPanel = $(currentPanel).prev()[0]
                } else {
                    prevPanel = null
                    $catalog_menu_close.removeClass('catalog-menu-close--white')
                }
            },300)
        }
    })
});
function toggle_panel_visibility ($lateral_panel, $background_layer, $body) {
    if( $lateral_panel.hasClass('speed-in') ) {
        // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
        $lateral_panel.removeClass('speed-in').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
            $body.removeClass('overflow-hidden');
            $body.css('padding-right', 0 + 'px')
            $('.header').css('padding-right', 0 + 'px')
        });
        $background_layer.removeClass('is-visible');

    } else {
        $lateral_panel.addClass('speed-in').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
            $body.addClass('overflow-hidden');
            $body.css('padding-right', getScrollbarWidth() + 'px')
            $('.header').css('padding-right', getScrollbarWidth() + 'px')
        });
        $background_layer.addClass('is-visible');
    }
}


// Search Modal
var headerSearch = $('#header-search')
var headerSearchModal =  $('#header-search-modal')
var headerSearchInput =  $('#header-search-input')
var headerSearchTrigger =  $('#header-search-trigger')
var headerSearchTriggerMobile =  $('#header-search-trigger-mobile')
var headerSearchModalLoader =  $('#header-search-modal__loader')
var headerSearchModalResults =  $('#header-search-modal__results')
var headerSearchModalIsOpen = false
var activeRequest = false
function getSearchResults() {
    return new Promise(resolve => setTimeout(() => resolve({
        results: [
            { name: "Коромысло выпускного клапана HPI", id: "1895269", inStock: true, price: "18000" },
            { name: "Коромысло пропуск", id: "1895270", inStock: true, price: "16000" },
            { name: "Коромысло HPI", id: "1895271", inStock: false, price: "22000" },
            { name: "Коромысло HPI", id: "1895271", inStock: false, price: "22000" },
            { name: "Коромысло HPI", id: "1895271", inStock: false, price: "22000" },
            { name: "Коромысло HPI", id: "1895271", inStock: false, price: "22000" },
            { name: "Коромысло HPI", id: "1895271", inStock: false, price: "22000" },
            { name: "Коромысло HPI", id: "1895271", inStock: false, price: "22000" },
            { name: "Коромысло HPI", id: "1895271", inStock: false, price: "22000" },

        ]
    }), 1500));
}
function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
function openHeaderSearchModal() {
    headerSearchModalLoader.css('display', 'block')
    headerSearchModalResults.css('display', 'none')
    headerSearchModalResults.html('')

    if (headerSearchInput.val().length > 0) {
        if (!activeRequest) {
            activeRequest = true
            getSearchResults().then((data) => {
                headerSearchModalLoader.css('display', 'none')
                headerSearchModalResults.css('display', 'block')
                activeRequest = false
                headerSearchModalResults.html('')
                if (data.results.length > 0) {
                    data.results.forEach(el => {
                        let inStock = el.inStock ? 'В наличии' : 'НЕТ в наличии'
                        headerSearchModalResults.append(`
                            <li class="header-search-modal__item">
                                <span class="header-search-modal__item-title">${el.name}</span>
                                <div class="header-search-modal__item-bottom">
                                    <div>
                                        <div class="header-search-modal__item-info">
                                            <span class="header-search-modal__item-id">Арт: ${el.id}</span>
                                            <span class="header-search-modal__item-stock">
                                                <img src="img/in-stock-icon.svg" alt="In Stock">
                                                <span>${inStock}</span>
                                            </span>
                                        </div>
                                        <span class="header-search-modal__item-price">
                                            ${numberWithSpaces(el.price)} ₽
                                        </span>
                                    </div>
                                    <button type="button" class="header-search-modal__item-btn-cart">В корзину</button>
                                </div>
                            </li>
                        `)
                    })
                } else {
                    headerSearchModalResults.append('<span class="header-search-modal__results-title">Ничего не найдено</span>')
                }
            })
        }
    } else {
        headerSearchModalLoader.css('display', 'none')
        headerSearchModalResults.css('display', 'block')
        headerSearchModalResults.append('<span class="header-search-modal__results-title">Введите что-нибудь</span>')
    }

    if (!headerSearchModalIsOpen) {
        headerSearchModal.addClass('header-search-modal--show')
        headerSearchModal.css('visibility', 'visible')
        headerSearchModalIsOpen = true
    }
}
function closeHeaderSearchModal() {
    headerSearchModal.removeClass('header-search-modal--show')
    setTimeout(() => {
        headerSearchModal.css('visibility', 'hidden')
        headerSearchModalLoader.css('display', 'block')
        headerSearchModalResults.css('display', 'none')
    },200)
    headerSearchModalIsOpen = false
}
headerSearchTrigger.click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    openHeaderSearchModal()
})
headerSearchInput.keypress(function(event){
    if(event.keyCode == 13){
        headerSearchTrigger.click();
    }
});
headerSearchInput.on('input propertychange', function () {
    if (headerSearchInput.val().length === 0) {
        closeHeaderSearchModal()
    }
})
headerSearchTriggerMobile.click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    headerSearch.toggleClass('header-search--show')
    if (headerSearch.hasClass('header-search--show')) {
        headerSearch.css('visibility', 'visible')
    } else {
        setTimeout(() => {
            headerSearch.css('visibility', 'hidden')
        },200)
    }

})
$(document).click(function(e){
    if($(e.target).closest(headerSearch).length != 0) return false;
    closeHeaderSearchModal()
    if (headerSearch.hasClass('header-search--show')) {
       setTimeout(() => {
           headerSearch.css('visibility', 'hidden')
       }, 200)
        headerSearch.removeClass('header-search--show')
    }
});