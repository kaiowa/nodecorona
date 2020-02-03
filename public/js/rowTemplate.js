var templateRow =_.template('<div class="row-entry"> \
<div class="name col-sm-6 col-xs-3"><img class="flag" src="/imgs/flags/<%=countryCode%>.svg"><%=province%> <%=country%></div>\
<div class="name col-sm-2 col-xs-3"><%=confirmed%></div>\
<div class="name col-sm-2 col-xs-3"><%=deaths%></div>\
<div class="name col-sm-2 col-xs-3"><%=recovered%></div>\
</div>');