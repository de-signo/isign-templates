<%@ Control Language="C#" AutoEventWireup="true" Inherits="Stolltec.Forms.Show.StyleControlBase, Stolltec.Forms.Core, Version=3.0.0.0, Culture=neutral, PublicKeyToken=9b480668faf77978" %>
<%@ Register TagPrefix="iss" Namespace="ISS.Web.UI" Assembly="ISS.Web" %>
<%@ Register Assembly="Stolltec.Forms.Core, Version=3.0.0.0, Culture=neutral, PublicKeyToken=9b480668faf77978"
    Namespace="Stolltec.Forms.Show" TagPrefix="st" %>
<link href="<%= ResolveUrl("Info3.css") %>" type="text/css" rel="Stylesheet" />

<asp:ScriptManagerProxy runat="server"> <Scripts> <asp:ScriptReference Name="jquery" /> </Scripts> </asp:ScriptManagerProxy>

<script src="<%= ResolveUrl("bind.js") %>" type="text/javascript"></script>
<script src="<%= ResolveUrl("hammer.min.js") %>" type="text/javascript"></script>
<script type="text/javascript">
$(document).ready(function() {
	var hammertime = new Hammer(document.body, {});
});
</script>

<div runat="server" id="topDiv" class="top">
    <st:ViewController runat="server" ID="vc" FieldKey="views" />
    <div class="lt0"></div>
</div>
<st:ResetControllerExtender runat="server" Interval="40000" TargetControlID="topDiv">
    <ResetTargets>
        <st:ViewControllerResetElement TargetControlID="vc" />
    </ResetTargets>
</st:ResetControllerExtender>
<st:DisableSelectExtender ID="DisableSelectExtender1" runat="server" TargetControlID="topDiv" />
<st:ClickBlankingExtender runat="server" BlankingTime="1000" TargetControlID="topDiv"/>

