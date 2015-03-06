var bwcModule = angular.module('bwcModule', []);
var Client = require('./bower_components/bitcore-wallet-client/index.js');

bwcModule.constant('MODULE_VERSION', '0.0.1');

bwcModule.provider("bwcService", function() {
  var provider = {};

  var config = { 
    baseUrl : 'http://localhost:3001/copay/api', 
    verbose: null
  };

  provider.setBaseUrl = function(url) {
    config.baseUrl = url;
  };

  provider.setVerbose = function(v) {
    config.verbose = v ? true : false;
  };

  provider.$get = function($timeout) {
    var service = {};

    var initWallet = function(walletData) {
      var bwc = new Client({
        baseUrl: config.baseUrl,
        verbose: config.verbose,
      });

      if (!walletData) {
        return bwc;
      }
      if (typeof(walletData) != 'string') {
        walletData = JSON.stringify(walletData);
      }

      bwc.import(walletData);
      return bwc;
    };

    service.getStatus = function(walletData, cb) {
      var c = initWallet(walletData);
      c.getStatus(function(err, res) {
        $timeout(function() {
          return cb(err, res);
        }, 1);
      });
    };

    service.open = function(walletData, cb) {
      var c = initWallet(walletData);
      c.openWallet(function(err, res) {
        $timeout(function() {
          return cb(err, res)
        }, 1);
      });
    };

    service.create = function(wallet, cb) {
      var walletName = wallet.walletName;
      var copayerName = wallet.copayerName;
      var mn = [wallet.m, wallet.n];
      var network = wallet.network;

      c = initWallet();

      c.createWallet(walletName, copayerName, mn[0], mn[1], network, function(err, secret) {
        $timeout(function() {
          return cb(err, secret, c.export());
        }, 1);
      });
    };

    service.join = function(wallet, cb) {
      var walletSecret = wallet.secret;
      var copayerName = wallet.copayerName;

      c = initWallet();

      c.joinWallet(walletSecret, copayerName, function(err, res) {
        $timeout(function() {
          return cb(err, res, c.export());
        }, 1);
      });
    };

    service.getAddress = function(walletData, cb) {
      var c = initWallet(walletData);
      c.createAddress(function(err, res) {
        $timeout(function() {
          return cb(err, res);
        }, 1);
      });
    };

    service.getAddresses = function(walletData, cb, opts) {
      var c = initWallet(walletData);
      opts = opts || { doNotVerify: true };
      c.getMainAddresses(opts, function(err, res) {
        $timeout(function() {
          return cb(err, res);
        }, 1);
      });
    };

    service.sendTransaction = function(walletData, tx, cb) {
      var c = initWallet(walletData);
      c.sendTxProposal(tx, function(err, res) {
        $timeout(function() {
          return cb(err, res);
        }, 1);
      });
    };

    service.signTransaction = function(walletData, txp, cb) {
      var c = initWallet(walletData);
      c.signTxProposal(txp, function(err, res) {
        $timeout(function() {
          return cb(err, res);
        }, 1);
      });
    };

    service.rejectTransaction = function(walletData, txp, cb, reason) {
      var c = initWallet(walletData);
      reason = reason || '';
      c.rejectTxProposal(txp, reason, function(err, res) {
        $timeout(function() {
          return cb(err, res);
        }, 1);
      });
    };

    service.broadcastTransaction = function(walletData, txp, cb) {
      var c = initWallet(walletData);
      c.broadcastTxProposal(txp, function(err, res) {
        $timeout(function() {
          return cb(err, res);
        }, 1);
      });
    };

    service.getHistory = function(walletData, cb, opts) {
      var c = initWallet(walletData);
      opts = opts || {};
      c.getTxHistory(opts, function(err, res) {
        $timeout(function() {
          return cb(err, res);
        }, 1);
      });
    };

    service.getBalance = function(walletData, cb) {
      var c = initWallet(walletData);
      c.getBalance(function(err, res) {
        $timeout(function() {
          return cb(err, res);
        }, 1);
      });
    };

    return service;
  };

  return provider;
});
