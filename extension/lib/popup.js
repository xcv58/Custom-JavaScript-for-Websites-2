(function($) {

  var popup = {
    key: 'popup',
    el: {
      popup: $('#customjs'),
      popupForm: $('#popup-form'),
      hostSelect: $('#host'),
      hostGoToLink: $('#goto-host'),
      enableCheck: $('#enable'),
      shareBtn: $('#share'),
      includeOpenPopboxLink: $('#open-popbox'),
      includePopbox: $('#include-popbox'),
      includeSelect: $('#include'),
      includeTextarea: $('#extra-scripts'),
      includeMask: $('#screen-mask'),
      sourceEditor: $('#ace-editor'),
      saveBtn: $('#save'),
      resetBtn: $('#reset'),
      draftRemoveLink: $('#draft-remove'),
      error: $('#error'),
      donateBtn: $('#donate'),
      donateForm: $('#donate-form')
    },
    shareUrl: 'http://hromadadan.com/customjs/share',
    title: {
      host: {
        select: "List of websites modified by Your custom js",
        goTo:  "Jump to the selected host"
      },
      share: "Share Your script with other people",
      save: "Save and apply this script",
      include: {
        textarea: 'Uncomment address of script below or type your own (one per line)',
        mask: 'Click to close textarea popup'
      },
      draft: "This is a draft, click to remove it"
    },
    applyTitles: function() {
      this.el.hostSelect.attr('title', this.title.host.select);
      this.el.hostGoToLink.attr('title', this.title.host.goTo);

      this.el.includeTextarea.attr('title', this.title.include.textarea);
      this.el.includeMask.attr('title', this.title.include.mask);

      this.el.shareBtn.attr('title', this.title.share);
      this.el.saveBtn.attr('title', this.title.save);
      this.el.shareBtn.attr('title', this.title.share);
      this.el.draftRemoveLink.attr('title', this.title.draft);
    },
    include: {
      predefined: [
        {
          name: 'jQuery 1.11.3',
          path: '/jquery/1.11.3/jquery.min.js'
        },
        {
          name: 'jQuery 2.1.4',
          path: '/jquery/2.1.4/jquery.min.js'
        }
      ],
      extra: [
        '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'
      ]
    },
    host: undefined,
    emptyDataPattern: {
      config: {
        enable: false,
        include: '',
        extra: ''
      },
      source: ''
    },
    data: null,
    editor: {
      instance: null,
      defaultValue: "// Here You can type your custom JavaScript...",
      value: '',
      init: function() {
        var editor = this.instance = ace.edit(popup.el.sourceEditor[0]);
        editor.setTheme("ace/theme/tomorrow");
        editor.getSession().setMode("ace/mode/javascript");
        editor.setHighlightActiveLine(false);
        editor.getSession().on('change', this.onChange);
      },
      apply: function(source) {
        var editor = this.instance;
        editor.setValue(source);
        editor.gotoLine(1);
      }
    },
    storage: {
      data: {
        private: {},
        global: {}
      },
      MODE: {
        private: 1,
        global: 2,
      },
      setMode: function(mode) {
        if( mode === this.MODE.private ) {
          this.key = popup.key + "-" + popup.protocol + "//" + popup.host;
          this.mode = this.MODE.private;
        }

        if( mode === this.MODE.global ) {
          this.key = popup.key;
          this.mode = this.MODE.global;
        }
      },
      load: function() {
        this.setMode(this.MODE.private);
        this._setData(JSON.parse(localStorage.getItem(this.key) || "{}"));

        this.setMode(this.MODE.global);
        this._setData(JSON.parse(localStorage.getItem(this.key) || "{}"));
      },
      _getData: function(key) {
        var storage = popup.storage;
        if( storage.mode == storage.MODE.private ) {
          if( key ) {
            return storage.data.private[key];
          }
          else {
            return storage.data.private;
          }
        }
        if( storage.mode == storage.MODE.global ) {
          if( key ) {
            return storage.data.global[key];
          }
          else {
            return storage.data.global;
          }
        }
      },
      _setData: function(data, key) {
        var storage = popup.storage;
        if( storage.mode == storage.MODE.private ) {
          if( key ) {
            storage.data.private[key] = data;
          }
          else {
            storage.data.private = data;
          }
        }
        if( storage.mode == storage.MODE.global ) {
          if( key ) {
            storage.data.global[key] = data;
          }
          else {
            storage.data.global = data;
          }
        }
      },
      get: function(key) {
        return this._getData(key);
      },
      set: function(arg1, arg2) {
        // arg1 is a key
        if( typeof arg1 === 'string' ) {
          this._setData(arg2, arg1);
        }
        // arg1 is data
        else {
          this._setData(arg1);
        }

        var str = JSON.stringify(this._getData() || {});
        localStorage.setItem(this.key, str);
      },
      remove: function(key) {
        if( key ) {
          var data = this._getData();
          delete data[key];

          if( $.isEmptyObject(data) ) {
            this.remove();
          }
          else {
            var str = JSON.stringify(this._getData());
            localStorage.setItem(this.key, str);
          }
        }
        else {
          localStorage.removeItem(this.key);
          this._setData({});
        }
      }
    },
    apiclb: {
      onSelectedTab: function(tab) {
        popup.tabId = tab.id;
        chrome.tabs.sendRequest(popup.tabId, {method: "getData", reload: false}, popup.apiclb.onGetData);
      },
      onGetData: function(response) {
        if( !response || typeof response.host !== 'string' ) {
          popup.error();
          return;
        }

        /**
         * Create 'hosts select'
         */

        popup.host = response.host;
        popup.protocol = response.protocol;

        // Load storage (global, local) IMPORTANT: Must be called first of all storage operations
        popup.storage.load();

        // Set storage to store data accessible from all hosts
        popup.storage.setMode(popup.storage.MODE.global);

        var hosts = popup.storage.get('hosts') || [],
            url = popup.protocol + "//" + response.host;

        // Add current host to list
        if( hosts.indexOf(url) === -1 ) {
          hosts.push(url);
        }

        // Fill 'hosts select'
        hosts.forEach(function(host) {
          var option = $('<option>' + host + '</option>');
          if( host === url ) {
            option.attr('selected', 'selected');
          }
          popup.el.hostSelect.append(option);
        });

        // Store host (current included in array) if is customjs defined
        if( response.customjs ) {
          popup.storage.set('hosts', hosts);
        }

        /**
         * Set-up data (script, enable, include, extra)
         */

        // Set-up data pattern if empty
        if( !popup.data ) {
          popup.data = $.extend(true, {}, popup.emptyDataPattern);
        }

        // Merge host's data to defaults
        popup.data = $.extend(popup.data, response.customjs);

        // ... source is now encoded as base64
        if( popup.data.source.indexOf('data:text/javascript;base64,') === 0 ) {
          popup.data.source = popup.data.source.replace('data:text/javascript;base64,', '');
          popup.data.source = atob(popup.data.source);
        }
        else if( popup.data.source.indexOf('data:text/javascript;charset=utf-8,') === 0 ) {
          popup.data.source = popup.data.source.replace('data:text/javascript;charset=utf-8,', '');
          popup.data.source = decodeURIComponent(popup.data.source);
        }

        // Set storage to store data accessible ONLY from current host
        popup.storage.setMode(popup.storage.MODE.private);

        // Save local copy of live data
        if( response.customjs ) {
          popup.storage.set('data', popup.data);
        }

        // Apply data (draft if exist)
        popup.applyData(popup.storage.get('draft'));
      }
    },
    generateScriptDataUrl: function(script) {
      var b64 = 'data:text/javascript';
      // base64 may be smaller, but does not handle unicode characters
      // attempt base64 first, fall back to escaped text
      try {
        b64 += (';base64,' + btoa(script));
      }
      catch(e) {
        b64 += (';charset=utf-8,' + encodeURIComponent(script));
      }

      return b64;
    },
    applyData: function(data, notDraft) {

      if( data && !notDraft ) {
        this.el.draftRemoveLink.removeClass('is-hidden');
      }

      data = data || this.data;

      // Default value for 'extra include'
      if( !data.config.extra ) {
        data.config.extra = '# ' + popup.title.include.textarea + "\n";
        popup.include.extra.forEach(function(url) {
          data.config.extra += '# ' + url + "\n";
        });
      }
      // Readable format for 'extra include'
      else {
        data.config.extra = data.config.extra.replace(';', "\n");
      }

      // Default value for source
      if( !data.source ) {
        data.source = popup.editor.defaultValue;
      }

      // Set 'predefined include' value
      popup.el.includeSelect.val(data.config.include);

      // Set enable checkbox
      popup.el.enableCheck.prop('checked', data.config.enable);

      // Fill 'extra include' textarea
      popup.el.includeTextarea.val(data.config.extra);

      // Apply source into editor
      popup.editor.apply(data.source);
    },
    getCurrentData: function() {
      return {
        config: {
          enable: popup.el.enableCheck.prop('checked'),
          include: popup.el.includeSelect.val(),
          extra: popup.el.includeTextarea.val()
        },
        source: popup.editor.instance.getValue()
      };
    },
    removeDraft: function() {
      popup.storage.setMode(popup.storage.MODE.private);
      popup.storage.remove('draft');

      popup.applyData();
      popup.el.draftRemoveLink.addClass('is-hidden');
    },
    save: function(e) {
      e.preventDefault();

      // Is allowed to save?
      if( popup.el.saveBtn.hasClass('pure-button-disabled') ) {
        return false;
      }

      var data = popup.getCurrentData();

      // Transform source for correct apply
      data.config.extra = data.config.extra.replace("\n", ';');
      data.source = popup.generateScriptDataUrl(data.source);

      // Send new data to apply
      chrome.tabs.sendRequest(popup.tabId, {method: "setData", customjs: data, reload: true});

      // Save local copy of data
      popup.storage.setMode(popup.storage.MODE.private);
      popup.storage.set('data', popup.data);

      // Clear draft
      popup.removeDraft();

      // Close popup
      window.close();

      return false;
    },
    reset: function(e) {
      e.preventDefault();

      // Is allowed to reset?
      if( popup.el.resetBtn.hasClass('pure-button-disabled') ) {
        return false;
      }

      if( confirm('Do you really want all away?') ) {
        // Remove stored data for current host
        popup.storage.setMode(popup.storage.MODE.private);
        popup.storage.remove();

        // Remove host from hosts inside global storage
        popup.storage.setMode(popup.storage.MODE.global);
        var oldHosts = popup.storage.get('hosts'),
            newHosts = [];
        oldHosts.forEach(function(host) {
          if( host !== popup.protocol + '//' + popup.host ) {
            newHosts.push(host);
          }
        });
        popup.storage.set('hosts', newHosts);

        // Remove customjs from frontend
        chrome.tabs.sendRequest(popup.tabId, {method: "removeData", reload: false});

        // Set-up empty data
        popup.data = $.extend(true, {}, popup.emptyDataPattern);
        popup.applyData();

        popup.removeDraft();
      }

      return false;
    },
    error: function() {
      popup.el.popup.addClass('customjs--error');
      popup.el.error.removeClass('is-hidden');
    }
  };

  window.popup = popup;

  /**
   * Add titles to elements
   */

  popup.applyTitles();


  /**
   * Click to goTo host link
   */
  popup.el.hostGoToLink.on('click', function() {
    var link = popup.el.hostSelect.val();
    chrome.tabs.sendRequest(popup.tabId, {method: "goTo", link: link, reload: false});
    window.close();
  });


  /**
   * Fill predefined libs to include
   */

  popup.include.predefined.forEach(function(lib) {
    var option = '<option value="' + lib.path + '">' + lib.name + '</option>';
    popup.el.includeSelect.append(option);
  });


  /**
   * Inicialize Ace Editor
   */

  popup.editor.init();


  /**
   * Connect front end (load info about current site)
   */

  chrome.tabs.getSelected(null, popup.apiclb.onSelectedTab);


  /**
   * 'Include extra scripts' control
   */

  popup.el.includeOpenPopboxLink.on('click', function() {
    popup.el.includePopbox.removeClass('is-hidden');
  });

  popup.el.includeMask.on('click', function() {
    popup.el.includePopbox.addClass('is-hidden');
  });


  /**
   * Auto save draft
   */

  var draftAutoSave = function() {
    var draft = popup.getCurrentData(),
        source = draft.source;

    if( (source || !popup.data.source) && source !== popup.data.source ) {

      popup.storage.setMode(popup.storage.MODE.private);
      popup.storage.set('draft', draft);

      // Auto switch 'enable checkbox' on source edit
      if( !popup.el.enableCheck.hasClass('not-auto-change') ) {
        popup.el.enableCheck.prop('checked', true);
      }
    }
  },
      draftAutoSaveInterval = setInterval(draftAutoSave, 2000);


  /**
   * Change host by select
   */

  popup.el.hostSelect.on('change', function(e) {
    var host = $(this).val(),
        hostData = JSON.parse(localStorage.getItem(popup.key + '-' + host), true);;

    if( host !== popup.protocol + '//' + popup.host ) {
      // Stop making drafts
      clearInterval(draftAutoSaveInterval);

      // Show goto link
      popup.el.hostGoToLink.removeClass('is-hidden');

      // Hide controls
      popup.el.saveBtn.addClass('pure-button-disabled');
      popup.el.resetBtn.addClass('pure-button-disabled');
      popup.el.draftRemoveLink.addClass('is-hidden');

      // Apply other host data
      try {
        popup.applyData(hostData.data, true);
      }
      // Hotfix for host without customjs
      catch(err) {
        popup.applyData($.extend(true, {}, popup.emptyDataPattern), true);
      }
    }
    else {
      // Start making drafts
      draftAutoSaveInterval = setInterval(draftAutoSave, 2000);

      // Hide goto link
      popup.el.hostGoToLink.addClass('is-hidden');

      // Show controls
      popup.el.saveBtn.removeClass('pure-button-disabled');
      popup.el.resetBtn.removeClass('pure-button-disabled');
      if( popup.storage.get('draft') ) {
        popup.el.draftRemoveLink.removeClass('is-hidden');
      }

      // Apply current host data
      popup.applyData(hostData.draft || hostData.data, hostData.draft ? false : true);
    }
  });


  /**
   * Protect 'enable checkbox' if was manually modified
   */
  popup.el.enableCheck.on('click', function() {
    $(this).addClass('not-auto-change');
  });

  /**
   * Save script
   */

  popup.el.saveBtn.on('click', popup.save);

  /**
   * Reset script
   */

  popup.el.resetBtn.on('click', popup.reset);


  /**
   * Remove draft
   */

  popup.el.draftRemoveLink.on('click', popup.removeDraft);


  /**
   * Donate
   */

  var donate = {
    button: popup.el.donateBtn,
    form: popup.el.donateForm
  };

  donate.button.on('click', function(e) {
    donate.form.find('input[name="submit"]').click();
    e.preventDefault();
  });


  /**
   * Share script
   */

  popup.el.shareBtn.on('click', function(e) {

    // Form popup form create share form
    popup.el.popupForm.attr({
      action: popup.shareUrl,
      target: '_blank'
    });

    // Paste script source to hodden input
    popup.el.popupForm.find('input[name="script"]').val(popup.getCurrentData().source);

  });

  // Animate share button if customjs enabled
  setInterval(function() {
    setTimeout(function() {
      if( popup.data.config.enable ) {
        popup.el.shareBtn.toggleClass('animated tada');
      }
    }, Math.round( Math.random() * 1000 ));
  }, 3000);


})(jQuery);
