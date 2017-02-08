<%@ Control Language="C#" AutoEventWireup="true" Inherits="Stolltec.Forms.Show.StyleControlBase, Stolltec.Forms.Core, Version=3.0.0.0, Culture=neutral, PublicKeyToken=9b480668faf77978" %>
<%@ Register TagPrefix="iss" Namespace="ISS.Web.UI" Assembly="ISS.Web" %>
<%@ Register Assembly="Stolltec.Forms.Core, Version=3.0.0.0, Culture=neutral, PublicKeyToken=9b480668faf77978"
    Namespace="Stolltec.Forms.Show" TagPrefix="st" %>
<%@ Register TagPrefix="my" Src="ItemList.ascx" TagName="ItemList" %>
<%@ Assembly Name="ISS, Version=4.0.0.0, Culture=neutral, PublicKeyToken=8ea0619067b237be" %>
<%--
  List.ascx

  Style for Stolltec.Forms 3.0. (Information)
  Child style for SignTop.ascx
  German locale
  List of entries which lead to a detailed view.
  Auto width, scrollable
--%>
<script runat="server" language="C#">
    protected override void OnPreRender(EventArgs e)
    {
        base.OnPreRender(e);

        ScriptManager.RegisterStartupScript(this, this.GetType(), "scrolltop",
             @"Sys.Application.add_load(function() {
                var el = document.getElementById('" + divScroll.ClientID + @"');
                if (el) el.scrollTop = 575;
                });", true);
    }
</script>

<st:Counter runat="server" Visible="false">
    <st:DisplayIdParameter Name="Display" />
    <asp:Parameter Name="File" DefaultValue="List.ascx" />
</st:Counter>

<%-- Header --%>

<div class="hl1" class="datum">                        <!--  ---- Datum u. Uhrzeit ----   -->
    <h2 runat="server" id="date" class="datum2" ></h2>
    <h2><span runat="server" id="time" class="zeit2"></span> Uhr</h2>
    <st:DateTimeExtender runat="server" ID="dteDate" TargetControlID="date" Format="dddd, dd.MM.yyyy" UpdateInterval="60000" />
    <st:DateTimeExtender runat="server" ID="dteTime" TargetControlID="time" Format="HH:mm" UpdateInterval="10000" />
</div>

<div class="hl2">          <!--  ----------- Suchbereichsanzeige + Button Startseite -----------   -->
    <h1>
        Ihr Suchbereich: A-Z
    </h1>
    <h2>
        <st:StyleElementControl runat="server" FieldKey="category" />
    </h2>
    <asp:LinkButton runat="server" CssClass="start2" Text="" CommandName="Reset" />


</div>


<%-- Body --%>

<st:StyleDataSource FieldKey="source" runat="server" ID="dsSource">
    <SelectParameters>
        <st:ViewParameter runat="server" FieldKey="category" Name="category" />
    </SelectParameters>
</st:StyleDataSource>

<div class="dl">

    <div id="divScroll" runat="server">               <!-- -------------- Auflistung List.ascx ----------------- -->
        <div class="spacer"></div>
        <my:ItemList ID="itemList" runat="server" DataSourceID="dsSource" />
    </div>

    <div class="scrollbar">                           <!-- -------------- Scrollbar ----------------- -->
        <div class="scrollup" runat="server" id="btnUp">
        </div>
        <iss:scrollbarcontrol runat="server" id="scRes" upbuttonid="btnUp" downbuttonid="btnDown"
            disablebuttoncssclass="disable_scroll" targetcontainerid="divScroll" cssclass="scroll"
            scrollingextenderid="scrollBehavior" />
        <div class="scrolldown" runat="server" id="btnDown">
        </div>
    </div>

</div>

<iss:FillBoxExtender runat="server" TargetControlID="divScroll" FillHeight="true" FillWidth="false" IgnoreSibblings="true" />
<iss:ScrollingExtender runat="server" TargetControlID="divScroll" ID="scrollBehavior"
    ScrollStep="575" StepInPercent="false" Linear="false" />



<div class="fl1">
    <div class="handl">                  <!-- -------------- Hand ----------------- -->
        <img id="circles" runat="server" class="ci" src="circlei2.png"/>
        <img id="circlel" runat="server" class="co" src="circleo2.png"/>
        <img id="hand" runat="server" class="hand" src="hand2.png" />
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

         <div class="position2">                      <!--  ----------- Button Startseite unten-----------   -->
             <asp:LinkButton runat="server" CssClass="start2" Text="" CommandName="Reset" />
         </div>

</div>