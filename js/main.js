$(document).ready(function () {
    if (navigator.userAgent.match(/Android/i)) {
        window.scrollTo(0, 0); // reset in case prev not scrolled  
        var nPageH = $(document).height();
        var nViewH = window.outerHeight;
        if (nViewH > nPageH) {
            nViewH -= 250;
            $('body').css('height', nViewH + 'px');
        }
        window.scrollTo(0, 1);
    }
});
$(window).load(function () {
    console.log(localStorage.getItem("go_sessionID"));
    if (window.navigator.onLine == false) {
        alert("Network Undetected!");
    }
    if (localStorage.getItem("go_sessionID") == 0) {
        $.mobile.navigate("#login");
    }
    else if (localStorage.getItem("go_sessionID") > 0) {
        changeMenuFunc();
        $('.username').html(localStorage.getItem("go_sessionNAME") + "<span>" + localStorage.getItem("go_sessionSTATUS") + "</span>");
        $('.my-id').html(localStorage.getItem("go_sessionSTOCKISTID"));
        //        $.mobile.navigate("#home");
    }
    else {
        $.mobile.navigate("#register");
    }
});

function changeMenuFunc() {
    var userRole = localStorage.getItem("go_sessionROLE");
    $('.profilepic img').attr("src", "https://placehold.it/160x160/F9B269/ffffff/&text=" + userRole);
    if (userRole == "Stockist") {
        $('.side-menu').html('<li class="text-center stock-id">GO ID <span class="my-id"></span></li><li><a href="#home" data-transition="slide"><span class="glyphicon glyphicon-home" aria-hidden="true"></span>Home</a></li> <li><a href="#order-history" data-transition="slide"><span class="glyphicon glyphicon-time" aria-hidden="true"></span>Order History</a></li> <li><a href="#agent-list" data-transition="slide"><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span>Agent List</a></li> <li><a href="#agent-performance" data-transition="slide"><span class="glyphicon glyphicon-tasks" aria-hidden="true"></span>Agent Performance</a></li>');
    }
    else if (userRole == "Agent") {
        $('.side-menu').html('<li><a href="#home" data-transition="slide"><span class="glyphicon glyphicon-home" aria-hidden="true"></span>Home</a></li> <li><a href="#my-order-history" data-transition="slide"><span class="glyphicon glyphicon-time" aria-hidden="true"></span>My Order History</a></li> <li><a href="#stockist-list" data-transition="slide"><span class="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span>Order Now</a></li>');
    }
    else if (userRole == "New") {
        $('.side-menu').html('<li><a href="#home" data-transition="slide"><span class="glyphicon glyphicon-home" aria-hidden="true"></span>Home</a></li> <li><a href="#agent-apply" data-transition="slide"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span>Agent Application</a></li>');
    }
}
$(document).ready(function () {
    $('#indexcarousal, #myCarousel').owlCarousel({
        autoPlay: 3000, //Set AutoPlay to 3 seconds
        items: 4
        , itemsDesktop: [1199, 3]
        , itemsDesktopSmall: [979, 3]
    });
    $(".opensidebarbtn,#close").click(function () {
        $('body').toggleClass("opensidebar");
    });
    $('.page .notification-btn').click(function () {
        $('.notification-list').slideToggle();
    });
    $("#twocolumn").click(function () {
        $('.worksportfolio').addClass("twocolumn");
        $('.worksportfolio').removeClass("threecolumn");
        $(this).addClass("active");
        $(" #threecolumn").removeClass("active");
    });
    $(" #threecolumn").click(function () {
        $('.worksportfolio').removeClass("twocolumn");
        $(this).addClass("active");
        $(" #twocolumn").removeClass("active");
    });
    $('html').click(function () {
        $('.notification-list').slideUp();
    });
    $('.opensidebarbtn, .sidebar').click(function (event) {
        event.stopPropagation();
    });
    $('.notification-btn').click(function (event) {
        event.stopPropagation();
    });
    $('.navbar-nav li a').click(function (event) {
        $(".navbar-nav li a").parent().removeClass("active");
        $(this).parent().addClass("active");
        $('body').removeClass("opensidebar");
    });
    $(".page").on("swiperight", function () {
        $('body').addClass("opensidebar");
    });
    $(".page").on("swipeleft", function () {
        $('body').removeClass("opensidebar");
    });
    $(".owl-carousel, .pswp--open, .pswp__scroll-wrap").on("swiperight", function (event) {
        event.stopPropagation();
    });
    var md = new MobileDetect(window.navigator.userAgent);
    if (md.mobile() != null || md.tablet() == true) {
        $("#devicemessage").html("This is <b>" + md.mobile() + "</b> and running on <b>" + md.os() + " </b> in the <b>" + md.userAgent() + "</b> User agent")
    }
    else {
        $("#devicemessage").html("This is Desktop device");
    }
    //    login function
    $('.login-btn').on('click', function () {
        preloaderDisplay();
        $.get('api/GO_USER_PROFILE.php?action=login', $('#login-form').serialize(), function (response) {
            if (response != "") {
                console.log(response);
                response = JSON.parse(response);
                localStorage.setItem("go_sessionID", response[0].obe_id);
                localStorage.setItem("go_sessionNAME", response[0].user_name);
                localStorage.setItem("go_sessionROLE", response[0].user_role);
                localStorage.setItem("go_sessionSTOCKISTID", response[0].stockist_id);
                localStorage.setItem("go_sessionSTATUS", response[0].status);
                changeMenuFunc();
                $.mobile.navigate("#home");
                $('.username').html(localStorage.getItem("go_sessionNAME") + "<span>" + localStorage.getItem("go_sessionSTATUS") + "</span>");
                $('.my-id').html(localStorage.getItem("go_sessionSTOCKISTID"));
            }
            else {
                alert("Failed");
                //                $.mobile.changePage('#failLoginModal', 'pop', true, true);
            }
            $.mobile.loading("hide");
        });
    });
    $('input[name=roleRadios]').each(function () {
        $(this).on('change', function () {
            if ($(this).val() == "be-agent") {
                $('input[name=regstockistid]').val('');
                var str = '<div class="text-center"><b>Stockist ID</b></div> <div class="form-group"> <input type="text" class="form-control" name="regstockist" placeholder="#ABC123" style="text-transform:uppercase"> <i>Note: Only fill this with ID from stockist to register network.</i> </div>';
                $('.pick-role').html(str);
            }
            else {
                $('input[name=regstockist]').val('');
                var randomID = "#";
                generateID();

                function generateID() {
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                    for (var i = 0; i < 6; i++) {
                        randomID += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    $.get('api/GO_USER_PROFILE.php?action=check_id', {
                        id: randomID
                    }, function (response) {
                        if (response == 1) {
                            var str = '<div class="text-center"><b>Stockist ID</b></div> <div class="form-group"> <input type="text" class="form-control" name="regstockistid" value="' + randomID + '" disabled> <i>Note: Provide this ID to your agents.</i> </div>';
                            $('.pick-role').html(str);
                            return randomID;
                        }
                        else {
                            generateID();
                        }
                    });
                }
            }
        });
    });
    $('#register-btn').on('click', function () {
        var count = 0;
        var form_count = 0;
        var pw_check = false;
        $('#register-form input.required').each(function (i, registerDataElement) {
            if ($(this).val() == '') {
                form_count++;
            }
        });
        if ($('#register-form input[name=regpassword1]').val() == $('#register-form input[name=regpassword2]').val()) {
            pw_check = true;
        }
        if (count != form_count) {
            alert("Please fill up the registration form.")
        }
        else {
            if (!$('input.agree-check').is(":checked")) {
                alert("Please accept our Terms & Conditions.");
            }
            else {
                if (pw_check == false) {
                    alert("Password confirmation failed.");
                }
                else {
                    preloaderDisplay();
                    var data = $('#register-form').serializeArray();
                    data.push({
                        name: 'regstockist'
                        , value: $('input[name=regstockist]').val()
                    }, {
                        name: 'regstockistid'
                        , value: $('input[name=regstockistid]').val()
                    });
                    $.get('api/GO_USER_PROFILE.php?action=register', data, function (response) {
                        if (response == "false") {
                            alert("Sorry, your email has been used");
                        }
                        else {
                            alert(response);
                            if (response == "Successful Register") {
                                $.mobile.navigate("#login");
                                $.mobile.loading("hide");
                            }
                        }
                    });
                }
            }
        }
    });
    $('.logout-btn').on('click', function () {
        if (confirm("Are you sure?") == true) {
            preloaderDisplay();
            localStorage.setItem("go_sessionID", "0");
            $('#agent-table tbody').html("");
            $.mobile.navigate("#login");
            $.mobile.loading("hide");
        }
    });
    /* photoswipe execution start */
    var initPhotoSwipeFromDOM = function (gallerySelector) {
        // parse slide data (url, title, size ...) from DOM elements 
        // (children of gallerySelector)
        var parseThumbnailElements = function (el) {
            var thumbElements = el.childNodes
                , numNodes = thumbElements.length
                , items = []
                , figureEl, linkEl, size, item;
            for (var i = 0; i < numNodes; i++) {
                figureEl = thumbElements[i]; // <figure> element
                // include only element nodes 
                if (figureEl.nodeType !== 1) {
                    continue;
                }
                linkEl = figureEl.children[0]; // <a> element
                size = linkEl.getAttribute('data-size').split('x');
                // create slide object
                item = {
                    src: linkEl.getAttribute('href')
                    , w: parseInt(size[0], 10)
                    , h: parseInt(size[1], 10)
                };
                if (figureEl.children.length > 1) {
                    // <figcaption> content
                    item.title = figureEl.children[1].innerHTML;
                }
                if (linkEl.children.length > 0) {
                    // <img> thumbnail element, retrieving thumbnail url
                    item.msrc = linkEl.children[0].getAttribute('src');
                }
                item.el = figureEl; // save link to element for getThumbBoundsFn
                items.push(item);
            }
            return items;
        };
        // find nearest parent element
        var closest = function closest(el, fn) {
            return el && (fn(el) ? el : closest(el.parentNode, fn));
        };
        // triggers when user clicks on thumbnail
        var onThumbnailsClick = function (e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
            var eTarget = e.target || e.srcElement;
            // find root element of slide
            var clickedListItem = closest(eTarget, function (el) {
                return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
            });
            if (!clickedListItem) {
                return;
            }
            // find index of clicked item by looping through all child nodes
            // alternatively, you may define index via data- attribute
            var clickedGallery = clickedListItem.parentNode
                , childNodes = clickedListItem.parentNode.childNodes
                , numChildNodes = childNodes.length
                , nodeIndex = 0
                , index;
            for (var i = 0; i < numChildNodes; i++) {
                if (childNodes[i].nodeType !== 1) {
                    continue;
                }
                if (childNodes[i] === clickedListItem) {
                    index = nodeIndex;
                    break;
                }
                nodeIndex++;
            }
            if (index >= 0) {
                // open PhotoSwipe if valid index found
                openPhotoSwipe(index, clickedGallery);
            }
            return false;
        };
        // parse picture index and gallery index from URL (#&pid=1&gid=2)
        var photoswipeParseHash = function () {
            var hash = window.location.hash.substring(1)
                , params = {};
            if (hash.length < 5) {
                return params;
            }
            var vars = hash.split('&');
            for (var i = 0; i < vars.length; i++) {
                if (!vars[i]) {
                    continue;
                }
                var pair = vars[i].split('=');
                if (pair.length < 2) {
                    continue;
                }
                params[pair[0]] = pair[1];
            }
            if (params.gid) {
                params.gid = parseInt(params.gid, 10);
            }
            return params;
        };
        var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0]
                , gallery, options, items;
            items = parseThumbnailElements(galleryElement);
            // define options (if needed)
            options = {
                // define gallery index (for URL)
                galleryUID: galleryElement.getAttribute('data-pswp-uid')
                , getThumbBoundsFn: function (index) {
                    // See Options -> getThumbBoundsFn section of documentation for more info
                    var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                        pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                        , rect = thumbnail.getBoundingClientRect();
                    return {
                        x: rect.left
                        , y: rect.top + pageYScroll
                        , w: rect.width
                    };
                }
            };
            // PhotoSwipe opened from URL
            if (fromURL) {
                if (options.galleryPIDs) {
                    // parse real index when custom PIDs are used 
                    // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                    for (var j = 0; j < items.length; j++) {
                        if (items[j].pid == index) {
                            options.index = j;
                            break;
                        }
                    }
                }
                else {
                    // in URL indexes start from 1
                    options.index = parseInt(index, 10) - 1;
                }
            }
            else {
                options.index = parseInt(index, 10);
            }
            // exit if index not found
            if (isNaN(options.index)) {
                return;
            }
            if (disableAnimation) {
                options.showAnimationDuration = 0;
            }
            // Pass data to PhotoSwipe and initialize it
            gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        };
        // loop through all gallery elements and bind events
        var galleryElements = document.querySelectorAll(gallerySelector);
        for (var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].setAttribute('data-pswp-uid', i + 1);
            galleryElements[i].onclick = onThumbnailsClick;
        }
        // Parse URL and open gallery if it contains #&pid=3&gid=1
        var hashData = photoswipeParseHash();
        if (hashData.pid && hashData.gid) {
            openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
        }
    };
    // execute above function
    initPhotoSwipeFromDOM('.demo-gallery');
    /* photoswipe execution ends */
    /* theme selection code */
    $("#defaulttheme").click(function () {
        $(".theme ul").slideToggle();
    });
    $(".theme ul li span").click(function () {
        var colorname = $(this).attr("class");
        $("body,#defaulttheme").attr("class", "");
        $("body,#defaulttheme").addClass(colorname);
        $(".theme ul").slideToggle();
        $(".theme ul li").removeClass("active");
        $(this).parent().addClass("active");
    });
});
$(document).on("pageshow", ".page", function () {
    $('body').removeClass("opensidebar");
    $('.footable').footable({
        pageSize: 20
    });
    var activePage = $.mobile.activePage.attr('id')
    if (activePage === 'agent-list') {
        $('#agent-table tbody').html("");
        ajaxCallAgent();

        function activateBtn() {
            $('.activate-agent').each(function () {
                $(this).on('click', function () {
                    if (confirm("Activate agent?") == true) {
                        preloaderDisplay();
                        var id = $(this).attr('data-id');
                        var parent_id = localStorage.getItem('go_sessionID');
                        $.get('api/GO_STOCKIST_CONTROLLER.php?action=agent_activate', {
                            id: id
                            , parent_id: parent_id
                        }, function (response) {
                            $.mobile.loading("hide");
                            if (response == 1) {
                                alert("Successfully Activated");
                                $('#agent-table tbody').html("");
                                ajaxCallAgent();
                            }
                            else {
                                alert("Failed to Activate");
                            }
                        });
                    }
                })
            });
            $('.deactivate-agent').each(function () {
                $(this).on('click', function () {
                    if (confirm("Deactivate agent?") == true) {
                        preloaderDisplay();
                        var id = $(this).attr('data-id');
                        var parent_id = localStorage.getItem('go_sessionID');
                        $.get('api/GO_STOCKIST_CONTROLLER.php?action=agent_deactivate', {
                            id: id
                            , parent_id: parent_id
                        }, function (response) {
                            $.mobile.loading("hide");
                            if (response == 1) {
                                alert("Successfully Deactivated");
                                $('#agent-table tbody').html("");
                                ajaxCallAgent();
                            }
                            else {
                                alert("Failed to Deactivate");
                            }
                        });
                    }
                })
            });
        }

        function ajaxCallAgent() {
            preloaderDisplay();
            $.get('api/GO_STOCKIST_CONTROLLER.php?action=agent_list', {
                id: localStorage.getItem("go_sessionID")
            }, function (response) {
                var data = JSON.parse(response);
                console.log(data);
                for (i = 0; i < data.length; i++) {
                    if (data[i].status == "Active") {
                        $('#agent-table tbody').append('<tr> <td>' + data[i].user_name + '</td> <td style="text-align:center"><span class="badge ' + data[i].status + '">' + data[i].status + '</span></td> <td>' + data[i].set_date + '</td> <td> <button type="button" class="btn btn-default btn-xs">View Detail</button><button type="button" class="btn btn-danger btn-xs deactivate-agent" data-id="' + data[i].obe_id + '">Deactivate</button> </td> </tr>');
                    }
                    else {
                        $('#agent-table tbody').append('<tr> <td>' + data[i].user_name + '</td> <td style="text-align:center"><span class="badge ' + data[i].status + '">' + data[i].status + '</span></td> <td>' + data[i].set_date + '</td> <td> <button type="button" class="btn btn-default btn-xs">View Detail</button><button type="button" class="btn btn-success btn-xs activate-agent" data-id="' + data[i].obe_id + '">Activate</button> </td> </tr>');
                    }
                }
                $('.footable').trigger('footable_redraw');
                $.mobile.loading("hide");
                activateBtn()
            });
        }
        $('#filter-agent').on('keyup', function () {
            var value = $(this).val();
            $.ajax({
                method: 'GET'
                , url: 'api/GO_STOCKIST_CONTROLLER.php?action=agent_search'
                , data: {
                    id: localStorage.getItem("go_sessionID")
                    , value: value
                }
                , success: function (data) {
                    var data = JSON.parse(data);
                    preloaderDisplay();
                    $('#agent-table tbody').html("");
                    if (data != '') {
                        for (i = 0; i < data.length; i++) {
                            if (data[i].status == "Active") {
                                $('#agent-table tbody').append('<tr> <td>' + data[i].user_name + '</td> <td style="text-align:center"><span class="badge ' + data[i].status + '">' + data[i].status + '</span></td> <td>' + data[i].set_date + '</td> <td> <button type="button" class="btn btn-default btn-xs">View Detail</button><button type="button" class="btn btn-danger btn-xs deactivate-agent" data-id="' + data[i].obe_id + '">Deactivate</button> </td> </tr>');
                            }
                            else {
                                $('#agent-table tbody').append('<tr> <td>' + data[i].user_name + '</td> <td style="text-align:center"><span class="badge ' + data[i].status + '">' + data[i].status + '</span></td> <td>' + data[i].set_date + '</td> <td> <button type="button" class="btn btn-default btn-xs">View Detail</button><button type="button" class="btn btn-success btn-xs activate-agent" data-id="' + data[i].obe_id + '">Activate</button> </td> </tr>');
                            }
                        }
                        $('.footable').trigger('footable_redraw');
                    }
                    else {
                        $('#agent-table tbody').html("<tr><td colspan='2' style='text-align:center'>No record found</td></tr>");
                        $('.footable').trigger('footable_redraw');
                        $('.footable-toggle').hide();
                    }
                    $('.footable').trigger('footable_redraw');
                    $.mobile.loading("hide");
                    activateBtn();
                }
            });
        });
    }
    if (activePage === 'stockist-list') {
        $('#stockists-container').html("");
        $.get('api/GO_STOCKIST_CONTROLLER.php?action=stockist_list', {
            id: localStorage.getItem("go_sessionID")
        }, function (response) {
            var response = JSON.parse(response);
            console.log(response);
            for (i = 0; i < response.length; i++) {
                var pad;
                if (i % 2 == 0 && i == 0) {
                    pad = "pad-right";
                }
                else {
                    pad = "pad-left";
                }
                $('#stockists-container').append('<div class="item col-xs-6 col-lg-6 ' + pad + '"> <div class="thumbnail"> <!--<img class="group list-group-image" src="http://placehold.it/400x250/000/fff" alt="" />--> <div class="caption stockist-name"> <h4 class="group inner list-group-item-heading"><b>' + response[i].user_name + '</b></h4> <p class="group inner list-group-item-text stockist-desc">' + response[i].brand_name + '</p> <div class="row"> <div class="col-xs-12 col-md-6"> <p class="lead total-product"><span style="color:#F57C00">' + response[i].total_item + '</span> Products</p> </div> <div class="col-xs-12 col-md-6"> <button class="btn btn-primary order-trigger" style="width:100%" data-id="' + response[i].obe_id + '">Order</button> </div> </div> </div> </div> </div>');
            }
            $('.order-trigger').each(function () {
                $(this).on('click', function () {
                    localStorage.setItem('go_sessionSTOCKISTID', $(this).attr('data-id'));
                    $.mobile.navigate("#order");
                });
            });
            $('#list').click(function (event) {
                event.preventDefault();
                $('#stockists-container .item').addClass('list-group-item').attr('style', 'border:none;padding:0 15px');
            });
            $('#grid').click(function (event) {
                event.preventDefault();
                $('#stockists-container .item').removeClass('list-group-item').removeAttr('style');
                $('#stockists-container .item').addClass('grid-group-item');
            });
        });
    }
    if (activePage === 'order') {
        //        preloaderDisplay();
        $.get('api/GO_STOCKIST_CONTROLLER.php?action=stockist_list', {
            id: localStorage.getItem("go_sessionID")
        }, function (response) {
            var response = JSON.parse(response);
            console.log(response);
            for (i = 0; i < response.length; i++) {
                if (response[i].obe_id == localStorage.getItem('go_sessionSTOCKISTID')) {
                    $('.stockist-name').html(response[i].user_name);
                    $('.stockist-brand').html(response[i].brand_name);
                }
            }
        });
        $('.product-list').html("");
        $.get('api/GO_PRODUCT_CONTROLLER.php?action=product_list&stockist-id=' + localStorage.getItem('go_sessionSTOCKISTID'), function (response) {
            var data = JSON.parse(response);
            console.log(data);
            for (i = 0; i < data.length; i++) {
                //                    if (data[i].status == "Active") {
                $('.product-list').append('<li class="list-group-item product-detail" data-id="' + data[i].product_id + '"> <div class="row"> <div class="col-xs-4"> <div class="product-img"><img class="product-image" alt="140x140" src="' + data[i].product_image + '"></div> </div> <div class="col-xs-8"> <div class="row">' + data[i].product_name + '</div> <div class="row"> <div class="col-xs-5 pull-right"> <input type="number" class="form-control order-quantity" placeholder="0" min="0" style="height:40px;text-align:right"> </div> </div> </div> </div> </li>');
                //                    }
            }
            $('.product-list').append('<li class="list-group-item"> <div class="row" style="text-align:right"> <div class="col-xs-4"> <b style="line-height:40px">TOTAL</b> </div> <div class="col-xs-8"> <div class="row"> <div class="col-xs-5 pull-right"> <input type="number" class="form-control total-quantity" placeholder="0" style="height:40px;text-align:right" disabled> </div> </div> </div> </div> </li>');
            $('.product-list').append('<li class="list-group-item"> <div class="row" style="text-align:right"> <div class="col-xs-4"> <b style="line-height:40px">METHOD</b> </div> <div class="col-xs-8"> <div class="row"> <div class="pull-right"> <span class="switch" style="margin:0;padding:0 15px;"><input id="cmn-toggle-7" class="max-toggle max-toggle-yes-no method" type="checkbox" checked><label for="cmn-toggle-7" data-on="COD" data-off="POST" style="margin:0"></label></span> </div> </div> </div> </div> </li>');
            //            $.mobile.loading("hide");
            /* order count */
            $('.order-quantity').each(function () {
                $(this).on('blur', function () {
                    var orderCount = 0;
                    $('.order-quantity').each(function () {
                        if ($(this).val() != '') {
                            orderCount += parseInt($(this).val());
                        }
                    });
                    $('.total-quantity').val(orderCount);
                });
            })
            $('.order-now').on('click', function () {
                if ($('.total-quantity').val() != 0) {
                    var method = "POST";
                    if ($('.method').is(':checked')) {
                        method = "COD";
                    }
                    if (confirm("Are you sure?\nOrder " + $('.total-quantity').val() + " pcs by " + method + "?") == true) {
                        jsonProduct = [];
                        $('.product-list .product-detail').each(function () {
                            var id = $(this).attr("data-id");
                            var quantity = $(this).find('.order-quantity').val();
                            item = {}
                            item["product_id"] = id;
                            item["quantity"] = quantity;
                            if (quantity != 0) {
                                jsonProduct.push(item);
                            }
                        });
                        localStorage.setItem('go_sessionORDERITEMS', jsonProduct.stringify());
                        localStorage.setItem('go_sessionMETHOD', method);
                        if (method == "POST" && response == 1) {
                            $.mobile.navigate("#address-pick");
                        }
                        else if (method == "COD" && response == 1) {
                            $.mobile.navigate("#order-invoice");
                        }
                        else {
                            alert("We are having difficulties processing your order.\nPlease try again.");
                        }
                        //                        $.get('api/GO_ORDER_CONTROLLER.php?action=order', {
                        //                            agent_id: localStorage.getItem('go_sessionID')
                        //                            , order_detail: jsonProduct
                        //                            , method: method
                        //                        }, function (response) {
                        //                            if (method == "POST" && response == 1) {
                        //                                $.mobile.navigate("#address-pick");
                        //                            }
                        //                            else if (method == "COD" && response == 1) {
                        //                                $.mobile.navigate("#order-invoice");
                        //                            }
                        //                            else {
                        //                                alert("We are having difficulties processing your order.\nPlease try again.");
                        //                            }
                        //                        });
                    }
                }
                else {
                    alert("Please enter quantity.");
                }
            });
        });
    }
    if (activePage === 'address-pick') {
        $.get('api/GO_USER_PROFILE.php?action=check_address', {
            obe_id: localStorage.getItem('go_sessionID')
        }, function (data) {
            $('.address-list').html("");
            console.log(data);
            var data = JSON.parse(data);
            for (i = 0; i < data.length; i++) {
                var def = "";
                if (data[i].default == 1) {
                    def = "[Default]";
                }
                var str = '<li class="list-group-item container address-detail" data-id="' + data[i].id + '"> <div class="col-xs-8" style="padding:0"> <b style="line-height:20px">' + data[i].receiver_name + '</b> </div> <div class="col-xs-4" style="padding:0"><span class="pull-right" style="color:#F57C00">' + def + '</span></div> <div class="col-xs-12" style="padding:0">' + data[i].address + '<br>' + data[i].postcode + ' ' + data[i].city + '<br>' + data[i].state + '</div> </li>';
                $('.address-list').append(str);
            }
            $('.address-list').append('<li class="list-group-item add-new-address"> <div> <b style="line-height:20px">Add new address</b> <span class="pull-right"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></span> </div></li>');
            $('.add-new-address').on('click', function () {
                $.mobile.navigate("#add-address");
            });
            $('.address-detail').each(function () {
                $(this).on('click', function () {
                    var address_id = $(this).attr('data-id');
                    localStorage.setItem('go_sessionADDRESSID', address_id);
                    $.mobile.navigate("#edit-address");
                });
            });
        });
    }
    if (activePage === 'add-address') {
//        $('input[name=postcode]').on('blur', function () {
//            $.get('http://maps.googleapis.com/maps/api/geocode/json', {
//                region: "my"
//                , address: $('input[name=postcode]').val()
//            }, function (response) {
////                response = JSON.parse(response);
//                console.log(response);
//            });
//        });
    }
    if (activePage === 'agent-apply') {
        $('.apply-btn').on('click', function () {
            preloaderDisplay();
            if ($('input[name=regstockist]').val() != '') {
                $.ajax('api/GO_USER_PROFILE.php?action=network', {
                    obe_id: localStorage.getItem("go_sessionID")
                    , regstockist: $('input[name=regstockist]').val()
                }, function (response) {
                    alert(response);
                    localStorage.setItem('go_sessionROLE', 'Agent');
                    $.mobile.navigate("#home");
                    location.reload();
                    $.mobile.loading("hide");
                });
            }
        });
    }
});
$(document).on("pageload", "body", function () {
    $('body').removeClass("opensidebar");
    $(document).on("swipeleft swiperight", "body", function (e) {
        if ($(".ui-page-active").jqmData("panel") !== "open") {
            if (e.type === "swipeleft") {
                $("#right-panel").panel("open");
            }
            else if (e.type === "swiperight") {
                $("#left-panel").panel("open");
            }
        }
    });
});
$(document).on('pagebeforechange', function (e, data) {
    var to = data.toPage
        , from = data.options.fromPage;
    if (typeof to === 'string') {
        var u = $.mobile.path.parseUrl(to);
        to = u.hash || '#' + u.pathname.substring(1);
        if (from) from = '#' + from.attr('id');
        if (localStorage.getItem("go_sessionID") != null && localStorage.getItem("go_sessionID") != 0 && to === '#login') {
            e.preventDefault();
            e.stopPropagation();
        }
        if (from === "#order" && to === "#stockist-list") {
            location.reload();
        }
    }
});

function preloaderDisplay() {
    var $this = $(this)
        , theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme
        , msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text
        , textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible
        , textonly = !!$this.jqmData("textonly");
    html = $this.jqmData("html") || "";
    $.mobile.loading("show", {
        text: msgText
        , textVisible: textVisible
        , theme: theme
        , textonly: textonly
        , html: html
    });
}