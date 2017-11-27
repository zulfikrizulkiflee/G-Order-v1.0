//function onLoad() {
//    document.addEventListener("deviceready", onDeviceReady, false);
//    document.addEventListener("backbutton", onBackKeyDown, false);
//}
// device APIs are available
$(".page").on("swiperight", function () {
    $('body').addClass("opensidebar");
});
$(".page").on("swipeleft", function () {
    $('body').removeClass("opensidebar");
});
//
//function onDeviceReady() {
    var local_api = "api/";
    var remote_api = "http://www.zfikri.tk/obe_api/";
    var api = "";

    function getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }
        if (/android/i.test(userAgent)) {
            return "Android";
        }
        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }
        return "unknown";
    }
    console.log(getMobileOperatingSystem());
    if (getMobileOperatingSystem() == "Android") {
        api = remote_api;
    }
    else {
        api = local_api;
    }

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
        $.mobile.navigate("#home");
    }
    else {
        $.mobile.navigate("#register");
    }

    function changeMenuFunc() {
        var userRole = localStorage.getItem("go_sessionROLE");
        //    $('.profilepic img').attr("src", "https://placehold.it/160x160/F9B269/ffffff/&text=" + userRole);
        if (userRole == "Stockist") {
            $('.side-menu').html('<li class="text-center stock-id">GO ID <span class="my-id"></span></li><li><a href="#home" data-transition="slide"><span class="glyphicon glyphicon-home" aria-hidden="true"></span>Home</a></li> <li><a href="#order-history" data-transition="slide"><span class="glyphicon glyphicon-time" aria-hidden="true"></span>Order History</a></li> <li><a href="#agent-list" data-transition="slide"><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span>Agent List</a></li> <li><a href="#agent-performance" data-transition="slide"><span class="glyphicon glyphicon-tasks" aria-hidden="true"></span>Agent Performance</a></li>');
        }
        else if (userRole == "Agent") {
            $('.side-menu').html('<li><a href="#home" data-transition="slide"><span class="glyphicon glyphicon-home" aria-hidden="true"></span>Home</a></li> <li><a href="#order-history" data-transition="slide"><span class="glyphicon glyphicon-time" aria-hidden="true"></span>My Order History</a></li> <li><a href="#stockist-list" data-transition="slide"><span class="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span>Order Now</a></li>');
        }
        else if (userRole == "New") {
            $('.side-menu').html('<li><a href="#home" data-transition="slide"><span class="glyphicon glyphicon-home" aria-hidden="true"></span>Home</a></li> <li><a href="#agent-apply" data-transition="slide"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span>Agent Application</a></li>');
        }
    }
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
        $.get(api + 'GO_USER_PROFILE.php?action=login', $('#login-form').serialize(), function (response) {
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
                    $.get(api + 'GO_USER_PROFILE.php?action=check_id', {
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
                    $.get(api + 'GO_USER_PROFILE.php?action=register', data, function (response) {
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
            $('.agent-list').html("");
            $.mobile.navigate("#login");
            $.mobile.loading("hide");
        }
    });
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
    $(document).on("pageshow", ".page", function () {
        $('body').removeClass("opensidebar");
        
        var activePage = $.mobile.activePage.attr('id')
            //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
            //
            //      GENERAL BLOCK
            //
            //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
        if (activePage === 'add-address') {
            $('#add-form input[name=postcode]').on('blur', function () {
                $.get('http://maps.googleapis.com/mapsapi+/geocode/json', {
                    region: "my"
                    , address: $('#add-form input[name=postcode]').val()
                }, function (response) {
                    console.log(response);
                    var state = response.results[0].address_components[1].long_name;
                    $('#add-form input[name=state]').val(state);
                });
            });
            $('#add-address .save-btn').on('click', function () {
                var reqLength = $('#add-form input.required').length;
                var filled = 0;
                $('#add-form input.required').each(function () {
                    if ($(this).val() == "") {
                        filled++;
                    }
                });
                if (filled == 0) {
                    console.log($('#add-form').serialize());
                    $.get(api + 'GO_ORDER_CONTROLLER.php?action=add_address&agent_id=' + localStorage.getItem('go_sessionID'), $('#add-form').serialize(), function (response) {
                        if (response == 1) {
                            $.mobile.navigate('#address-pick');
                            location.reload();
                        }
                        else {
                            console.log(response);
                        }
                    });
                }
                else {
                    alert("Please complete the form.");
                }
            });
        }
        if (activePage === 'edit-address') {
            $.get(api + 'GO_USER_PROFILE.php?action=check_address', {
                obe_id: localStorage.getItem('go_sessionID')
            }, function (data) {
                data = JSON.parse(data);
                for (i = 0; i < data.length; i++) {
                    if (data[i].id == localStorage.getItem('go_sessionADDRESSID')) {
                        console.log(data[i]);
                        $('#edit-form input[name=receiver-name]').val(data[i].receiver_name);
                        $('#edit-form input[name=phone-num]').val(data[i].phone_num);
                        $('#edit-form input[name=receiver-address]').val(data[i].address);
                        $('#edit-form input[name=receiver-city]').val(data[i].city);
                        $('#edit-form input[name=postcode]').val(data[i].postcode);
                        $('#edit-form input[name=state]').val(data[i].state);
                        if (data[i].default_address == 1) {
                            $('#edit-form input[name=default]').prop("checked", true);
                        }
                    }
                }
                if ($('#edit-form input[name=default]').is(':checked')) {
                    $('#edit-form .default-label').on('click', function (e) {
                        alert("Sorry, must set another address as default.");
                        e.preventDefault();
                    });
                }
            });
            $('#edit-form input[name=postcode]').on('blur', function () {
                $.get('http://maps.googleapis.com/mapsapi+/geocode/json', {
                    region: "my"
                    , address: $('#edit-form input[name=postcode]').val()
                }, function (response) {
                    console.log(response);
                    var state = response.results[0].address_components[1].long_name;
                    $('#edit-form input[name=state]').val(state);
                });
            });
            $('#edit-address .save-btn').on('click', function () {
                var reqLength = $('#edit-form input.required').length;
                var filled = 0;
                $('#edit-form input.required').each(function () {
                    if ($(this).val() == "") {
                        filled++;
                    }
                });
                if (filled == 0) {
                    console.log($('#edit-form').serialize());
                    $.get(api + 'GO_ORDER_CONTROLLER.php?action=edit_address&agent_id=' + localStorage.getItem('go_sessionID') + '&address_id=' + localStorage.getItem('go_sessionADDRESSID'), $('#edit-form').serialize(), function (response) {
                        if (response == 1) {
                            $.mobile.navigate('#address-pick');
                            location.reload();
                        }
                        else {
                            console.log(response);
                        }
                    });
                }
                else {
                    alert("Please complete the form.");
                }
            });
            $('#edit-address .delete-btn').on('click', function () {
                if (confirm("Remove address?") == true) {
                    $.get(api + 'GO_ORDER_CONTROLLER.php?action=delete_address&agent_id=' + localStorage.getItem('go_sessionID') + '&address_id=' + localStorage.getItem('go_sessionADDRESSID'), function (response) {
                        if (response == 1) {
                            $.mobile.navigate('#address-pick');
                            location.reload();
                        }
                        else {
                            console.log(response);
                        }
                    });
                }
            });
        }
        //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
        //
        //      STOCKIST BLOCK
        //
        //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
        if (activePage === 'agent-list') {
            ajaxCallAgent();

            function activateBtn() {
                $('input[name=status]').each(function () {
                    $(this).on('change', function (e) {
                        if ($(this).is(':checked') == false) {
                            if (confirm("Deactivate agent?") == true) {
                                preloaderDisplay();
                                var id = $(this).attr('data-id');
                                var parent_id = localStorage.getItem('go_sessionID');
                                $.get(api + 'GO_STOCKIST_CONTROLLER.php?action=agent_deactivate', {
                                    id: id
                                    , parent_id: parent_id
                                }, function (response) {
                                    $.mobile.loading("hide");
                                });
                            }
                            else {
                                $(this).prop('checked', true);
                            }
                        }
                        else {
                            if (confirm("Activate agent?") == true) {
                                preloaderDisplay();
                                var id = $(this).attr('data-id');
                                var parent_id = localStorage.getItem('go_sessionID');
                                $.get(api + 'GO_STOCKIST_CONTROLLER.php?action=agent_activate', {
                                    id: id
                                    , parent_id: parent_id
                                }, function (response) {
                                    $.mobile.loading("hide");
                                });
                            }
                            else {
                                $(this).prop('checked', false);
                            }
                        }
                    });
                });
            }

            function ajaxCallAgent() {
                //            preloaderDisplay();
                $.get(api + 'GO_STOCKIST_CONTROLLER.php?action=agent_list', {
                    id: localStorage.getItem("go_sessionID")
                }, function (response) {
                    $('.agent-list').html("");
                    var data = JSON.parse(response);
                    console.log(data);
                    for (i = 0; i < data.length; i++) {
                        var status = (data[i].status == "Active") ? 'checked' : '';
                        var str = '<div class="row agent-row" data-id="' + data[i].obe_id + '"> <div class="col-xs-2 no-padding"> <img class="agent-img" src="https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png"> </div> <div class="col-xs-10"> <div class="row agent-details"> <div class="col-xs-8"><b>' + data[i].agent_name + '</b></div> <div class="col-xs-4 total-order no-padding"><div class="switch pull-right" style="margin:0"> <input id="cmn-toggle-' + data[i].obe_id + '" data-id="' + data[i].obe_id + '" name="status" class="max-toggle max-toggle-round-flat" type="checkbox" data-role="none" ' + status + '> <label for="cmn-toggle-' + data[i].obe_id + '" style="margin:0"></label> </div></div> <div class="col-xs-4 order-gauge no-padding"></div> </div> <div class="row"> <div class="col-xs-8 set_date">' + data[i].set_date + '</div> </div> </div> </div>';
                        $('.agent-list').append(str);
                    }
                    //                $.mobile.loading("hide");
                    activateBtn();
                });
            }
            $('#filter-agent').on('keyup', function () {
                var value = $(this).val();
                $.ajax({
                    method: 'GET'
                    , url: api + 'GO_STOCKIST_CONTROLLER.php?action=agent_search'
                    , data: {
                        id: localStorage.getItem("go_sessionID")
                        , value: value
                    }
                    , success: function (data) {
                        var data = JSON.parse(data);
                        console.log(data);
                        preloaderDisplay();
                        $('.agent-list').html("");
                        if (data != '') {
                            for (i = 0; i < data.length; i++) {
                                var status = (data[i].status == "Active") ? 'checked' : '';
                                var str = '<div class="row agent-row" data-id="' + data[i].obe_id + '"> <div class="col-xs-2 no-padding"> <img class="agent-img" src="https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png"> </div> <div class="col-xs-10"> <div class="row agent-details"> <div class="col-xs-8"><b>' + data[i].agent_name + '</b></div> <div class="col-xs-4 total-order no-padding"><div class="switch pull-right" style="margin:0"> <input id="cmn-toggle-' + data[i].obe_id + '" data-id="' + data[i].obe_id + '" name="status" class="max-toggle max-toggle-round-flat" type="checkbox" data-role="none" ' + status + '> <label for="cmn-toggle-' + data[i].obe_id + '" style="margin:0"></label> </div></div> <div class="col-xs-4 order-gauge no-padding"></div> </div> <div class="row"> <div class="col-xs-8 set_date">' + data[i].set_date + '</div> </div> </div> </div>';
                                $('.agent-list').append(str);
                            }
                        }
                        else {
                            $('.agent-list').html("<div class='container' style='text-align:center'>No Records Found</div>");
                        }
                        $.mobile.loading("hide");
                        activateBtn();
                    }
                });
            });
        }
        if (activePage === 'order-history') {
            function DropDown(el) {
                this.month = el;
                this.placeholder = this.month.children('span');
                this.opts = this.month.find('.dropdown a');
                this.val = '';
                this.index = -1;
                this.initEvents();
            }
            DropDown.prototype = {
                initEvents: function () {
                    var obj = this;
                    obj.month.on('click', function (event) {
                        $('#year').removeClass('active');
                        $(this).toggleClass('active');
                        return false;
                    });
                    obj.opts.on('click', function () {
                        var opt = $(this);
                        obj.val = opt.text();
                        obj.index = opt.index();
                        obj.placeholder.text(obj.val);
                    });
                }
                , getValue: function () {
                    return this.val;
                }
                , getIndex: function () {
                    return this.index;
                }
            }

            function DropDown2(el) {
                this.year = el;
                this.placeholder = this.year.children('span');
                this.opts = this.year.find('.dropdown a');
                this.val = '';
                this.index = -1;
                this.initEvents();
            }
            DropDown2.prototype = {
                initEvents: function () {
                    var obj = this;
                    obj.year.on('click', function (event) {
                        $('#month').removeClass('active');
                        $(this).toggleClass('active');
                        return false;
                    });
                    obj.opts.on('click', function () {
                        var opt = $(this);
                        obj.val = opt.text();
                        obj.index = opt.index();
                        obj.placeholder.text(obj.val);
                    });
                }
                , getValue: function () {
                    return this.val;
                }
                , getIndex: function () {
                    return this.index;
                }
            }
            $(function () {
                var month = new DropDown($('#month'));
                var year = new DropDown2($('#year'));
            });
            
            var role = (localStorage.getItem("go_sessionROLE") == "Stockist") ? "stockist" : "agent";
            
            if (role == "agent") {
                $('#order-history .page_title').html("My Order History"); 
            }else{
                $('#order-history .page_title').html("Order History");
            }

            $.get(api + 'GO_ORDER_CONTROLLER.php?action='+role+'_order_history' + '&obe_id=' + localStorage.getItem('go_sessionID'), function (response) {
                $('.order-list').html("");
                response = JSON.parse(response);
                console.log(response);
                var monthArr = [];
                var yearArr = [];
                for (i = 0; i < response.length; i++) {
                    if (response[i].order_status != null) {
                        var month = response[i].month;
                        var year = response[i].year;
                        if (monthArr.indexOf(month) < 0) {
                            monthArr.push(month);
                        }
                        if (yearArr.indexOf(year) < 0) {
                            yearArr.push(year);
                        }
                    }
                }
                $('.month-list').html("");
                $('.year-list').html("");
                for (i = 0; i < monthArr.length; i++) {
                    if (i == 0) {
                        $('.month-select span').html(monthArr[i]);
                    }
                    var str = '<li><a href="#" data-month="' + monthArr[i] + '">' + monthArr[i] + '</a></li>';
                    $('.month-list').append(str);
                }
                for (i = 0; i < yearArr.length; i++) {
                    if (i == 0) {
                        $('.year-select span').html(yearArr[i]);
                    }
                    var str = '<li><a href="#" data-year="' + yearArr[i] + '">' + yearArr[i] + '</a></li>';
                    $('.year-list').append(str);
                }
                $('.month-list a').each(function () {
                    $(this).on('click', function () {
                        var month = $(this).attr('data-month');
                        var year = $('.year-list').html();
                    });
                });
                for (i = 0; i < response.length; i++) {
                    if (response[i].order_status != null) {
                        var quantity = 0;
                        var itemArr = JSON.parse(response[i].order_detail);
                        $.each(itemArr, function (j, item) {
                            quantity += parseInt(item.quantity);
                        });
                        var method = (response[i].method == "POST") ? "#d9534f" : "#20BE76";
                        var date = response[i].create_date.split(" ");
                        console.log(date);
                        var date_day = date[1].split(",");
                        date_day = (date_day[0].length == 1) ? "0" + date_day[0] : date_day[0];
                        var order_str = '<div class="container order-detail" data-id="' + response[i].order_id + '"> <div class="col-xs-12 order-panel" style="border-left:8px solid ' + method + ';"> <div class="col-xs-2 no-padding" style="border-right:1px solid #eee;text-align: center"> <div style="font-size: 2em"><b>' + date_day + '</b></div> <div>' + date[0] + '</div> </div> <div class="col-xs-10" style="line-height: 30px"> <div><b>' + response[i].user_name + '</b></div> <div>' + quantity + ' pcs<span class="badge ' + response[i].status + '" style="float: right">' + response[i].status + '</span></div> </div> </div> </div>';
                        $('.order-list').append(order_str);
                    }
                }
                $('.order-detail').each(function () {
                    $(this).on('click', function () {
                        localStorage.setItem('go_sessionORDERID', $(this).attr('data-id'));
                        $.mobile.navigate('#order-invoice');
                    });
                });
            });
        }
        if (activePage === 'agent-performance') {
            $.get(api + 'GO_STOCKIST_CONTROLLER.php?action=agent_performance&obe_id=8', function (response) {
                $('.agent-container').html("");
                response = JSON.parse(response);
                console.log(response);
                for (i = 0; i < response.length; i++) {
                    var total_quantity = (response[i].total_quantity == null) ? 0 : response[i].total_quantity;
                    var last_order_date = (response[i].last_order_date == null) ? "No record" : "Last order " + response[i].last_order_date;
                    var total_agent_quantity = response[i].total_agent_quantity;
                    var gauge_value = (total_quantity / total_agent_quantity) * 100;
                    var str = '<div class="row agent-row" data-id="' + response[i].obe_id + '"> <div class="col-xs-2 no-padding"> <img class="agent-img" src="https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png"> </div> <div class="col-xs-10"> <div class="row agent-details"> <div class="col-xs-8"><b>' + response[i].agent_name + '</b></div> <div class="col-xs-4 order-gauge no-padding"><div class="progress"> <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="' + gauge_value + '" aria-valuemin="0" aria-valuemax="100" style="width:' + gauge_value + '%"> <span class="sr-only">60% Complete (warning)</span> </div> </div></div> </div> <div class="row"> <div class="col-xs-8 last-order">' + last_order_date + '</div> <div class="col-xs-4 total-order no-padding">' + total_quantity + ' pcs</div> </div> </div> </div>';
                    $('.agent-container').append(str);
                }
                $('.agent-row').each(function () {
                    $(this).on('click', function () {
                        var obe_id = $(this).attr('data-id');
                        localStorage.setItem('go_sessionAGENTID', obe_id);
                        $.mobile.navigate("#agent-performance-detail");
                    });
                });
            });
        }
        //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
        //
        //      AGENT BLOCK
        //
        //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
        if (activePage === 'stockist-list') {
            $('#stockists-container').html("");
            $.get(api + 'GO_AGENT_CONTROLLER.php?action=stockist_list', {
                id: localStorage.getItem("go_sessionID")
            }, function (response) {
                var response = JSON.parse(response);
                console.log(response);
                //            if(response.length == 1){
                //                localStorage.setItem('go_sessionSTOCKISTID', response[0].obe_id);
                //                $.mobile.navigate("#order");
                //            }else{
                for (i = 0; i < response.length; i++) {
                    var pad;
                    if (i % 2 == 0 && i == 0) {
                        pad = "pad-right";
                    }
                    else {
                        pad = "pad-left";
                    }
                    var dis = "";
                    if (response[i].total_item == 0) {
                        dis = "disabled";
                    }
                    $('#stockists-container').append('<div class="item col-xs-6 col-lg-6 ' + pad + '"> <div class="thumbnail"> <!--<img class="group list-group-image" src="http://placehold.it/400x250/000/fff" alt="" />--> <div class="caption stockist-name"> <h4 class="group inner list-group-item-heading"><b>' + response[i].user_name + '</b></h4> <p class="group inner list-group-item-text stockist-desc">' + response[i].brand_name + '</p> <div class="row"> <div class="col-xs-12 col-md-6"> <p class="lead total-product"><span style="color:#F57C00">' + response[i].total_item + '</span> Products</p> </div> <div class="col-xs-12 col-md-6"> <button class="btn btn-primary order-trigger" style="width:100%" data-id="' + response[i].obe_id + '" ' + dis + '>Order</button> </div> </div> </div> </div> </div>');
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
                //            }
            });
        }
        if (activePage === 'order') {
            //        preloaderDisplay();
            localStorage.setItem('go_sessionORDERID', null);
            $.get(api + 'GO_AGENT_CONTROLLER.php?action=stockist_list', {
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
            $.get(api + 'GO_PRODUCT_CONTROLLER.php?action=product_list&stockist-id=' + localStorage.getItem('go_sessionSTOCKISTID'), function (response) {
                var data = JSON.parse(response);
                console.log(data);
                for (i = 0; i < data.length; i++) {
                    //                    if (data[i].status == "Active") {
                    $('.product-list').append('<li class="list-group-item product-detail" data-id="' + data[i].product_id + '"> <div class="row"> <div class="col-xs-4"> <div class="product-img"><img class="product-image" alt="140x140" src="' + data[i].product_image + '"></div> </div> <div class="col-xs-8"> <div class="row">' + data[i].product_name + '</div> <div class="row"> <div class="col-xs-5 pull-right"> <input type="number" class="form-control order-quantity" placeholder="0" min="0" style="height:40px;text-align:right"> </div> </div> </div> </div> </li>');
                    //                    }
                }
                $('.product-list').append('<li class="list-group-item"> <div class="row" style="text-align:right"> <div class="col-xs-4"> <b style="line-height:40px">TOTAL</b> </div> <div class="col-xs-8"> <div class="row"> <div class="col-xs-5 pull-right"> <input type="number" class="form-control total-quantity" placeholder="0" style="height:40px;text-align:right" disabled> </div> </div> </div> </div> </li>');
                $('.product-list').append('<li class="list-group-item"> <div class="row" style="text-align:right"> <div class="col-xs-4"> <b style="line-height:40px">METHOD</b> </div> <div class="col-xs-8"> <div class="row"> <div class="pull-right"> <span class="switch" style="margin:0;padding:0 15px;"><input id="cmn-toggle-7" class="max-toggle max-toggle-yes-no method" type="checkbox" checked><label for="cmn-toggle-7" data-on="COD" data-off="POST" style="margin:0"></label></span> </div> </div> </div> </div> </li>');
                $('.product-list').append('<li class="list-group-item"><input type="text" name="note" max="50" class="form-control order-note" placeholder="Note"></li>')
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
                            localStorage.setItem('go_sessionORDERITEMS', JSON.stringify(jsonProduct));
                            localStorage.setItem('go_sessionMETHOD', method);
                            $.get(api + 'GO_ORDER_CONTROLLER.php?action=order', {
                                agent_id: localStorage.getItem('go_sessionID')
                                , order_detail: jsonProduct
                                , method: method
                                , total_quantity: $('.total-quantity').val()
                                , note: $('.order-note').val()
                                , stockist_id: localStorage.getItem('go_sessionSTOCKISTID')
                            }, function (response) {
                                if (method == "POST" && response > 0) {
                                    localStorage.setItem('go_sessionORDERID', response);
                                    $.mobile.navigate("#address-pick");
                                }
                                else if (method == "COD" && response > 0) {
                                    localStorage.setItem('go_sessionORDERID', response);
                                    $.mobile.navigate("#cod-option");
                                }
                                else {
                                    alert("We are having difficulties processing your order.\nPlease try again.");
                                }
                            });
                        }
                    }
                    else {
                        alert("Please enter quantity.");
                    }
                });
            });
        }
        if (activePage === 'address-pick') {
            $('#edit-form input[name=default]').prop("checked", false);
            $('#edit-form input[name=default]').attr("disabled", false);
            $.get(api + 'GO_USER_PROFILE.php?action=check_address', {
                obe_id: localStorage.getItem('go_sessionID')
            }, function (data) {
                $('.address-list').html("");
                console.log(data);
                var data = JSON.parse(data);
                for (i = 0; i < data.length; i++) {
                    var def = "";
                    var styleBorder = "";
                    if (data[i].default_address == 1) {
                        localStorage.setItem('go_sessionADDRESSID', data[i].id);
                        def = "[Default]";
                        styleBorder = "border:2px solid #F57C00";
                    }
                    var str = '<li class="list-group-item container address-detail" data-id="' + data[i].id + '" style="' + styleBorder + '"> <div class="col-xs-8" style="padding:0"> <b style="line-height:20px">' + data[i].receiver_name + '</b> </div> <div class="col-xs-4" style="padding:0"><span class="pull-right" style="color:#F57C00">' + def + '</span></div> <div class="col-xs-12" style="padding:0">(+60' + data[i].phone_num + ')<br>' + data[i].address + '<br>' + data[i].postcode + ' ' + data[i].city + '<br>' + data[i].state + '</div> </li>';
                    $('.address-list').append(str);
                }
                $('.address-list').append('<li class="list-group-item add-new-address"> <div> <b style="line-height:20px">Add new address</b> <span class="pull-right"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></span> </div></li>');
                $('.add-new-address').on('click', function () {
                    $.mobile.navigate("#add-address");
                });
                $('.address-detail').each(function () {
                    $(this).on('click', function () {
                        $('.address-detail').each(function () {
                            $(this).removeAttr("style");
                        });
                        var address_id = $(this).attr('data-id');
                        localStorage.setItem('go_sessionADDRESSID', address_id);
                        $(this).attr("style", "border:2px solid #F57C00");
                        //                    $.mobile.navigate("#edit-address");
                    });
                });
                $('.next-btn').on('click', function () {
                    if (confirm("Complete order?") == true) {
                        $.get(api + 'GO_ORDER_CONTROLLER.php?action=update_address&address_id=' + localStorage.getItem('go_sessionADDRESSID') + '&order_id=' + localStorage.getItem('go_sessionORDERID'), function (response) {
                            if (response == 1) {
                                $.mobile.navigate("#order-invoice");
                            }
                            else {
                                console.log(response);
                            }
                        });
                    }
                });
            });
        }
        if (activePage === 'cod-option') {
            $('#cod-option .save-btn').on('click', function () {
                var reqLength = $('#cod-info input.required').length;
                var filled = 0;
                $('#cod-info input.required').each(function () {
                    if ($(this).val() == "") {
                        filled++;
                    }
                });
                if (filled == 0) {
                    console.log($('#cod-info').serialize());
                    $.get(api + 'GO_ORDER_CONTROLLER.php?action=update_cod', $('#cod-info').serialize() + '&order_id=' + localStorage.getItem('go_sessionORDERID'), function (response) {
                        if (response == 1) {
                            $.mobile.navigate('#order-invoice');
                        }
                        else {
                            console.log(response);
                        }
                    });
                }
                else {
                    alert("Please complete the form.");
                }
            });
        }
        if (activePage === 'order-invoice') {
            $('tbody').html("");
            $.get(api + 'GO_ORDER_CONTROLLER.php?action=order_invoice' + '&order_id=' + localStorage.getItem('go_sessionORDERID'), function (response) {
                response = JSON.parse(response);
                console.log(response);
                $('.order_id').html(response[0].order_id);
                //            agent
                $('.user_name').html(response[0].user_name);
                $('.user_phone').html('(+6' + response[0].user_phone + ')');
                //            receiver
                if (response[0].method == "POST") {
                    $('.receiver_name').html(response[0].receiver_name);
                    $('.receiver_phone').html('(+6' + response[0].phone_num + ')');
                    $('.receiver_address').html(response[0].address);
                    $('.receiver_postcode').html(response[0].postcode + ' ' + response[0].city);
                    $('.receiver_state').html(response[0].state);
                }
                else {
                    $('.receiver_name').html(response[0].cod_name);
                    $('.receiver_phone').html('(+6' + response[0].cod_phone_num + ')');
                    $('.receiver_address').html(response[0].cod_location);
                    $('.receiver_postcode').html(response[0].cod_date + ' ' + response[0].cod_time);
                    $('.receiver_state').hide();
                }
                //            detail
                $('.method').html(response[0].method);
                $('.create_date').html(response[0].create_date);
                var item = JSON.parse(response[0].order_detail);
                if (response[0].note != null || response[0].note != "") {
                    $('.order-info .order-note').html(response[0].note);
                }
                console.log(item);
                var total_quantity = 0;
                for (i = 0; i < item.length; i++) {
                    var item_str = '<tr> <td class="product_id_' + item[i].product_id + '">' + item[i].product_id + '</td> <td class="product_name_' + item[i].product_id + ' text-center"></td> <td class="product_quantity_' + item[i].product_id + ' text-center">' + item[i].quantity + '</td> </tr>';
                    $('.item-summary tbody').append(item_str);
                    $.get(api + 'GO_PRODUCT_CONTROLLER.php?action=product_single' + '&product-id=' + item[i].product_id, function (product_data) {
                        product_data = JSON.parse(product_data);
                        var selectt = ".product_name_" + product_data[0].product_id;
                        $(selectt).html(product_data[0].product_name);
                    });
                    total_quantity += parseInt(item[i].quantity);
                }
                $('.item-summary tfoot .total_item').html(total_quantity);
            });
        }
        if (activePage === 'agent-apply') {
            $('.apply-btn').on('click', function () {
                preloaderDisplay();
                
                if ($('#agent-apply input[name=regstockist]').val() != '') {
                    $.get(api + 'GO_USER_PROFILE.php?action=network', {
                        obe_id: localStorage.getItem("go_sessionID")
                        , regstockist: $('#agent-apply input[name=regstockist]').val()
                    }, function (response) {
                        if(response == 1){
                            alert("Succesfully Connected");
                            localStorage.setItem('go_sessionROLE', 'Agent');
                            $.mobile.navigate("#home");
                            location.reload();
                            $.mobile.loading("hide");
                        }else{
                            alert("Failed");
                            $.mobile.loading("hide");
                        }  
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
            if (from === "#address-pick" && to === "#order") {
                location.reload();
            }
            if ((from === "#my-order-history" && to === "#order-invoice") || (from === "#order-history" && to === "#order-invoice")) {
                $('#order-invoice .opensidebarbtn').remove()
                $('#order-invoice .header').prepend('<a href="#" data-rel="back"> <button class="btn btn-primary pull-left backsidebarbtn"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button> </a>');
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
//}

//var lastTimeBackPress=0;
//var timePeriodToExit=2000;
//
//function onBackKeyDown(e){
//    e.preventDefault();
//    e.stopPropagation();
//    if(new Date().getTime() - lastTimeBackPress < timePeriodToExit){
//        navigator.app.exitApp();
//    }else{
//        window.plugins.toast.showWithOptions(
//            {
//                message: "Press again to exit.",
//                duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
//                position: "bottom",
//                addPixelsY: -40  // added a negative value to move it up a bit (default 0)
//            }
//        );
//
//        lastTimeBackPress=new Date().getTime();
//    }
//}