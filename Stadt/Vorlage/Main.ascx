<%@ Control Language="c#" AutoEventWireup="false" Inherits="Stolltec.Forms.Show.StyleControlBase, Stolltec.Forms.Core, Version=3.0.0.0, Culture=neutral, PublicKeyToken=9b480668faf77978"
    TargetSchema="http://schemas.microsoft.com/intellisense/ie5" %>
<%@ Register Assembly="Stolltec.Forms.Core, Version=3.0.0.0, Culture=neutral, PublicKeyToken=9b480668faf77978"
    Namespace="Stolltec.Forms.Show" TagPrefix="st" %>
<%--
  SignMain.ascx
  
  Style for Stolltec.Forms 3.0. (Information)
  Child style for SignTop.ascx
  German locale
  Optimized for 1920x1080
  List of categories which lead to a detailed view.
  Auto width, scrollable
--%>
<script runat="server" language="C#">
   
    void ItemCommand(object sender, EventArgs ea)
    {
        var cea = ea as CommandEventArgs;
        RaiseBubbleEvent(sender, cea);
    }
</script>
<!-- Begin SignMain.ascx -->
<div class="lm1">
</div>

<%-- Header --%>
<div class="hm1">
    <h2 runat="server" id="date"></h2>
    <h2><span runat="server" id="time"></span> Uhr</h2>
    <st:DateTimeExtender runat="server" ID="dteDate" TargetControlID="date" Format="dddd, dd.MM.yyyy" UpdateInterval="60000" />
    <st:DateTimeExtender runat="server" ID="dteTime" TargetControlID="time" Format="HH:mm" UpdateInterval="10000" />
    <h1>Wegweiser</h1>
</div>
<div class="hm2">
    <img id="Img1" runat="server" alt="header" src="header1.jpg" />
</div>

<%-- Data --%>
<div class="lm2">
</div>
<st:StyleDataSource FieldKey="source" runat="server" ID="dsSource" />
<div runat="server" id="categoryList" class="dm1">
    <asp:Repeater runat="server" ID="rp" DataSourceID="dsSource" OnItemCommand="ItemCommand">
        <ItemTemplate>
            <asp:LinkButton runat="server" ID="lnk" CommandName="SelectView">
                <st:StyleElementProperty runat="server" TargetControlID="lnk" PropertyName="CommandArgument"
                 Format="?__VIEWKEY=list&category={0}" FieldKey="id" />
                    <st:StyleElementControl runat="server" FieldKey="name" />
            </asp:LinkButton>
        </ItemTemplate>
    </asp:Repeater>
  <div class="handm">
        <img id="circles" runat="server" class="ci" src="circlei1.png"/>
        <img id="circlel" runat="server" class="co" src="circleo1.png"/>
        <img id="hand" runat="server" class="hand" src="hand1.png" />
        <ajax:AnimationExtender ID="AnimationExtender2" runat="server" TargetControlID="hand">
            <Animations>
                <OnLoad>
                <Sequence Iterations="0">
                    <HideAction AnimationTarget="circlel" />
                    <HideAction AnimationTarget="circles" />

                    <Move Relative="True" Horizontal="-30" Duration="1" Fps="25" />
                    <Move Relative="True" Vertical="-5" Duration="0.2" Fps="25" />
                    <Move Relative="True" Vertical="5" Duration="0.2" Fps="25" />

                    <HideAction AnimationTarget="circles" Visible="True" />
                    
                    <Color  Duration=".2" Fps="10" StartValue="#000000" EndValue="#000000" Property="Color"/>
                    <HideAction AnimationTarget="circlel" Visible="True" />
                    <Color  Duration=".8" Fps="5" StartValue="#000000" EndValue="#000000" Property="Color" />
                    <Move Relative="True" Horizontal="30" Duration="1" Fps="25" />
                    <Color  Duration=".5" Fps="4" StartValue="#000000" EndValue="#000000" Property="Color" />

                </Sequence>
                </OnLoad>
            </Animations>
        </ajax:AnimationExtender>
    </div>
</div>

<div class="l3">
</div>


<st:DisableSelectExtender runat="server" TargetControlID="categoryList" />
<st:ContentController runat="server" ID="contentController" PauseOnEmptyData="true" DataSourceID="dsSource" />

<!-- End SignMain.ascx -->
