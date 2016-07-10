"use strict";

//Init
var Event = {};

//Init event widget
Event = Event || {};
Event.Widget = Event.Widget || {};

//Component
Event.Widget.TemplateParser = (function ($) {

    var protocol            = 'http';
    var resourceUrl         = 'api.helsingborg.se';
    var basePrefix          = '/json/';

    var eventEndpoint       = basePrefix + 'wp/v2/event/';
    var contactEndpoint     = basePrefix + 'wp/v2/contact/';
    var locationEndpoint    = basePrefix + 'wp/v2/location/';
    var mediaEndpoint       = basePrefix + 'wp/v2/media/';

    var eventResource       = protocol + "://" + resourceUrl + eventEndpoint;

    var template            = {};
    var errorTemplate       = {};

    function TemplateParser() {
        this.init();
    }

    TemplateParser.prototype.init = function () {
        $(".event-api").each(function(index,module){
            this.storeErrorTemplate($(module));
            this.storeTemplate($(module));
            this.storeModalTemplate($(module));
            this.loadEvent($(module),eventResource);
        }.bind(this));
    };

    TemplateParser.prototype.storeTemplate = function (module) {
        module.data('template',$('.template',module).html());
        module.find('.template').remove();
    };

    TemplateParser.prototype.storeErrorTemplate = function (module) {
        module.data('error-template',$('.error-template',module).html());
        module.find('.error-template').remove();
    };

    TemplateParser.prototype.storeModalTemplate = function (module) {
        module.data('modal-template',$('.modal-template',module).html());
        module.find('.modal-template').remove();
    };

    TemplateParser.prototype.loadEvent = function(module, resource){

        $.ajax(resource).done(function(response) {

            if(typeof response.data == 'undefined') {

                //Store response on module
                module.data('json-response', response);

                //Clear target div
                this.clear(module);

                $(response).each(function(index,event){

                    //Load template data
                    var moduleTemplate = module.data('template');

                    //Replace with values
                    moduleTemplate = moduleTemplate.replace('{{event-id}}', event.id);
                    moduleTemplate = moduleTemplate.replace('{{event-title}}', event.title.rendered);

                    //Append
                    module.append(moduleTemplate);

                });

                //bind click
                this.click(module);

            } else {
                this.clear(module);
                module.html(module.data('error-template'));
            }

        }.bind(this)).fail(function() {

            this.clear(module);
            module.html(module.data('error-template'));

        }.bind(this));
    };

    TemplateParser.prototype.loadFeaturedImage = function(media, module){
        $.ajax(media).done(function(response) {
            //console.log(response);
        }.bind(this)).fail(function() {
            console.log("Could not load the media id.");
        }.bind(this));
    };

    TemplateParser.prototype.loadContactPerson = function(contact, module){
        $.ajax(contact).done(function(response) {
            //console.log(response);
        }.bind(this)).fail(function() {
            console.log("Could not load contact person.");
        }.bind(this));
    };

    TemplateParser.prototype.loadLocation = function(location, module) {
        $.ajax(location).done(function(response) {
            //console.log(response);
        }.bind(this)).fail(function() {
            console.log("Could not load location details.");
        }.bind(this));
    };

    TemplateParser.prototype.clear = function(module){
        jQuery(module).html('');
    };

    TemplateParser.prototype.click = function(module){

        jQuery("li a",module).on('click',{},function(e){

            var eventId = jQuery(e.target).closest("a.modal-event").data('event-id');

            $.each(module.data('json-response'), function(index,object) {

                if(object.id == eventId) {

                    //Main modal
                    var modalTemplate = module.data('modal-template');
                        modalTemplate = modalTemplate.replace('{{event-modal-title}}', object.title.rendered);
                        modalTemplate = modalTemplate.replace('{{event-modal-content}}',object.content.rendered);
                        modalTemplate = modalTemplate.replace('{{event-modal-image}}','');

                        //Ocations tempate
                        var modalOccationResult = "";
                        $.each(object.occasions, function(occationindex,occation) {
                            console.log(occation);
                            modalOccationResult = modalOccationResult + '<li>' + occation.start_date + ' - ' + occation.end_date + '</li>';
                        }.bind(this));
                        modalTemplate = modalTemplate.replace('{{event-modal-occations}}','<div class="box box-panel box-panel-secondary"><h4 class="box-title">Evenemanget inträffar</h4><ul id="modal-occations">' + modalOccationResult + '</ul></div>');

                    $('#modal-event').remove();
                    $('body').append(modalTemplate);

                    /*this.loadLocation("",module);
                    this.loadContactPerson("",module);
                    this.loadFeaturedImage("",module);*/

                }

            }.bind(this));

        }.bind(this));

    };

    return new TemplateParser();

})(jQuery);
