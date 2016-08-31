(function($, undefined) {
  var lockKey = 'clickLockedId';
  $.fn.releaseClickLocked = function(){
    var tid = this.data(lockKey);
    if(tid!==undefined){
      clearTimeout(tid);
    }
    $(this).removeData(lockKey);
  };
  $.fn.singleClick = function(handler, timeout) {
    timeout = timeout===undefined ? 500:timeout;
    $(this).click(function(evt){
      var self = $(this);
      if(self.data(lockKey)!==undefined){
        return false;
      }
      var tid = setTimeout(function(){
        self.releaseClickLocked();
      },timeout);
      self.data(lockKey, tid);
      return handler.apply(this,[evt]);
    });
  };
})(jQuery);