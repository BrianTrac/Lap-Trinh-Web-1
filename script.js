$(document).ready(function () {
    
    // Sync hover effect and click effect
    const $menuItems = $('.menu-item');

    $menuItems.on('mouseenter', function () {
        const index = $(this).data('index');
        syncHover(index, true);
    });

    $menuItems.on('mouseleave', function () {
        const index = $(this).data('index');
        syncHover(index, false);
    });

    $menuItems.on('click', function(e) {
        e.preventDefault(); 
        
        const index = $(this).data('index');
       
        $menuItems.removeClass('active');
        
        $(`.menu-item[data-index="${index}"]`).addClass('active');
    });

    function syncHover(index, isHovering) {
        
        $(`.menu-item[data-index=${index}]`).each(function () {
            console.log('syncHover', index, isHovering);
            if (isHovering) {
                $(this).addClass('hover');
            } else {
                $(this).removeClass('hover');
            }
        });
    }

    // Accordion
    $('#left').accordion({
        header: "> div > h3",
        collapsible: true,
        active: false,
        heightStyle: "content",
        icons: false,
        beforeActivate: function(event, ui) {
            // Prevent activation if the click is on the h3 but not on the toggle icon
            if (!$(event.originalEvent.target).hasClass('toggle-icon')) {
              event.preventDefault();
              return false;
            }
          }
    });

    $('#left').sortable({
        axis: "y",
        handle: ".drag-icon",
        stop: function (event, ui) {
            ui.item.children('h3').triggerHandler('focusout');
        //    $(this).accordion('refresh');
        }
    });

    $(".toggle-icon").on("click", function (event) {
        event.stopPropagation(); // Prevent the click from propagating to the entire h3 header

        var $header = $(this).closest("h3");
        var $content = $header.next(".content");
        var $newsItem = $header.parent(".news-item");
        var index = $newsItem.index();
        $content.slideToggle();

        if ($(this).hasClass("ui-icon-triangle-1-e")) {
            $(this).removeClass("ui-icon-triangle-1-e").addClass("ui-icon-arrowthick-1-s");
            $header.css({
                "color": "white",
                "background-color": "rgb(233,144,49)",
            });
        } else {
            $(this).removeClass("ui-icon-arrowthick-1-s").addClass("ui-icon-triangle-1-e");
            $header.css({
                "color": "",
                "background-color": "",
            });
        }

        // Manually activate/deactivate the accordion panel
        $('#left').accordion("option", "active", $content.is(":visible") ? index : false);
    });

    $("h3").on("click", function(event) {
        event.stopPropagation();
        event.preventDefault();
    });

    //  Process Text
    var essayText ="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa ratione dolorum, sunt deleniti laborum asperiores molestias! Provident cumque amet, quod consequatur, ut animi sequi voluptate numquam, possimus quo quisquam minima. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora distinctio, expedita nostrum minus culpa ipsa veritatis labore incidunt, beatae quibusdam maiores dolorum. Quaerat provident pariatur aliquam earum excepturi ratione fugit? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem odit doloribus rem. Tempora ullam id porro, exercitationem ipsam nihil minus eveniet. Cum neque, eveniet hic repellat doloremque sapiente a nihil. Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, vel, nulla distinctio numquam quae praesentium optio velit quo sapiente quidem cumque iure ex aperiam debitis error fuga voluptates. Maiores, sapiente?";
    

    const $essayContent = $('#essay-content');

    $('#sample').css({
        'color': $('#text-color').val(),
        'background-color': $('#bg-color').val(),
    });
   
    // Highlight function
    function applyHighlight(type) {
        console.log('applyHighlight: ', type);
        if (type === "highlight") {
            var word = $('#search-input').val().trim();
        } else {
            var word = $('#sample').text().trim();
        }

        if (word) {
            var regex = new RegExp(word, 'gi');
            if (type === 'highlight') {
                var text = $essayContent.text();
            }
            else {
                var text = $('#sample').text();
            }
            var textColor = $('#text-color').val();
            var bgColor = $('#bg-color').val();
            var isBold = $('#bold').is(':checked') ? 'font-weight: bold;' : '';
            var isItalic = $('#italic').is(':checked') ? 'font-style: italic;' : '';
            var isUnderline = $('#underline').is(':checked') ? 'text-decoration: underline;' : '';
            
            var highlightedText = text.replace(regex, function (match) {
                
                return '<p style="color: ' + textColor + '; background-color: ' + bgColor + '; ' + isBold + isItalic + isUnderline + 'display: inline;  word-spacing: normal;">' + match + '</p>';
            });

            if (type === 'highlight') {
                $essayContent.html(highlightedText);
            }
            else {
                $('#sample').html(highlightedText);
            }
        }
    }

    // Apply the highlight when clicking the button
    $('#highlight').click(function () {
        applyHighlight('highlight');
    });

    // Delete functionby RegExp
    $('#delete').on('click', function () {
        var word = $('#search-input').val().trim();
        if (word) {
            var regex = new RegExp(word, 'gi');
            var text = $('#essay-content').text();
            var newText = text.replace(regex, '');
            $('#essay-content').html(newText);
        }
    });

    // Reset function
    $('#reset').on('click', function () {
        $('#essay-content').html(essayText);
        $('#search-input').val('');
        $('#text-color').val('#000000');
        $('#bg-color').val('#ffffff');
        $('#bold, #italic, #underline').prop('checked', false);
        $('#sample').html('SampleText').css({
            'color': '#000000',
            'font-weight': 'normal',
            'font-size': '15px',
        });
    });

    // Sample text will display the preview output of choosing a highlight style
    $('#text-color, #bg-color, #bold, #italic, #underline').change(function() {
        applyHighlight('sample');
    });

    $('#text-color').change(function () {
        applyHighlight('highlight');
    });

     // Toggle format options
    $('#format-options-toggle').click(function () {
        debugger;
        $('#format-options').toggle();
    });

    // Close format options when clicking outside
    $(document).click(function(event) {
        if (!$(event.target).closest('#format-options, #format-options-toggle').length) {
            $('#format-options').hide();
        }
    });


    // DRAG VS DROP
    $('.add-btn').click(function () {
        debugger;
        let selectedValue = $('.select-ctn').val();
        console.log(selectedValue);

        let newDiv = $('<div></div>').addClass('icon-container');

        let newPanel = $('<div></div>').addClass('panel');
        let newIcon = $('<i></i>');
        let newTitle = $('<span></span>')
        switch (selectedValue) {
            case 'rat':
                newIcon.text('🐁');
                newTitle.text('Rat');
                break;
            case 'buffalo':
                newIcon.text('🐃');
                newTitle.text('buffalo');
                break;
            case 'tiger':
                newIcon.text('🐅');
                newTitle.text('Tiger');
                break;
            case 'cat':
                newIcon.text('🐈');
                newTitle.text('Cat');
                break;
            case 'dragon':
                newIcon.text('🐉');
                newTitle.text('Dragon');
                break;
            case 'snake':
                newIcon.text('🐍');
                newTitle.text('Snake');
                break;
            case 'horse':
                newIcon.text('🐎');
                newTitle.text('Horse');
                break;
            case 'goat':
                newIcon.text('🐐');
                newTitle.text('Goat');
                break;
            case 'monkey':
                newIcon.text('🐒');
                newTitle.text('Monkey');
                break;
            case 'rooster':
                newIcon.text('🐓');
                newTitle.text('Rooster');
                break;
            case 'dog':
                newIcon.text('🐕');
                newTitle.text('Dog');
                break;
            case 'pig':
                newIcon.text('🐖');
                newTitle.text('Pig');
                break;

            default: break;
        }
        // add icon onto panel
        newPanel.append(newIcon);
        //add panel and title to div tag    
        newDiv.append(newPanel);
        newDiv.append(newTitle);

        $('.drag-drop-container').append(newDiv);
    });

    // handel drag drop area
    $(".drag-drop-container").sortable({
        items: ".icon-container",
        cursor: "move",
        handle: ".panel, i",
        placeholder: "placeholder",
        revert: 200,
        scroll: true,
        tolerance: "pointer",
        start: function (event, ui) {
            ui.item.addClass("highlight-drag");
        },
        stop: function (event, ui) {
            ui.item.removeClass("highlight-drag");
        }
    });

});