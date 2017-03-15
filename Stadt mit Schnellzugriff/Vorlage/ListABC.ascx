<%@ Control Language="C#" AutoEventWireup="true" ClassName="Stolltec.Forms.Show.ListABC" CodeFile="Code.cs" Inherits="Stolltec.Forms.Show.ListABCBase"%>
<%@ Register Assembly="Stolltec.Forms.Core, Version=3.0.0.0, Culture=neutral, PublicKeyToken=9b480668faf77978"
    Namespace="Stolltec.Forms.Show" TagPrefix="st" %>

<%--
  Style for Stolltec.Forms 3.0. (Information)
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

        // Script f�r Formatierung des Schnellzugriffs (nicht verwendete Buchstaben ausschlie�en)
        ScriptManager.RegisterStartupScript(this, this.GetType(), "anchor",
            @"Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(function() {
                $(""a.Schnellzugr3"").each(function() {" +
                    // href ist z.B. ""#anchorW"" das kann auch als jquery id-selektor verwendet werden.
                    // hier wird also gepr�ft, ob der als href angegebene anchor auch existiert.
                    @"var href = $(this).attr(""href"");
                    if ($(href).length == 0) {
                        $(this).addClass(""unbenutzt"");
                    }
                });

                $(""#ToggleHandicap"").click(function() {
                    $(document.body).toggleClass(""handicapped"");
                });
            });", true);
    }
</script>


<st:Counter runat="server" Visible="false">
    <st:DisplayIdParameter Name="Display" />
    <asp:Parameter Name="File" DefaultValue="ListABC.ascx" />
</st:Counter>

<%-- Header --%>

<div class="hl1" class="datum">                     <!--  ---- Datum u. Uhrzeit ----   -->
    <span runat="server" id="date" class="ausgeblendet"></span>
    <span runat="server" id="time" class="ausgeblendet"></span>
    <st:DateTimeExtender runat="server" ID="dteDate" TargetControlID="date" Format="dddd, dd.MM.yyyy" UpdateInterval="60000" />
    <st:DateTimeExtender runat="server" ID="dteTime" TargetControlID="time" Format="HH:mm" UpdateInterval="10000" />

    <div class="text3">
        <st:StyleElementControl runat="server" FieldKey="category" />
    </div>

</div>

<%-- oben --%>



<div class="position1">                      <!--  ----------- Button Startseite (oben)-----------   -->
    <asp:LinkButton runat="server" CssClass="start2" Text="" CommandName="Reset" />
</div>




<%-- Body --%>
<st:StyleDataSource FieldKey="source" runat="server" ID="dsSource">
    <SelectParameters>
        <st:ViewParameter runat="server" FieldKey="category" Name="category" />
    </SelectParameters>
</st:StyleDataSource>


<div class="text1">Bitte den Anfangsbuchstaben des gesuchten Begriffs w�hlen: </div>

<%-- Schnellzugriff --%>              <!-- -------------- Schnellzugriff ----------------- -->
<ul class="Schnellzugr">
        <% for (char a = 'A'; a <= 'Z'; a++) { %>
           <li class="Schnellzugr2"> <a href="#anchor<%= a %>"  class="Schnellzugr3"><%= a %></a> </li>
        <% } %>
</ul>

<hr class="linie1">





<div class="dl">

    <div id="divScroll" runat="server">                            <!-- -------------- Auflistung ----------------- -->
        <div class="spacer"></div>
        <ul class="groups">
            <%-- Placeholder is replaced by a grouped list (See Code.cs)--%>
                <asp:PlaceHolder runat="server" ID="repeaterPlaceholder" />
        </ul>
    </div>

    <div class="scrollbar">                     <!-- -------------- Scrollbar ----------------- -->
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

<%-- Schnellzugriff --%>              <!-- -------------- Schnellzugriff unten ----------------- -->

<ul class="Schnellzugr handicap-only">
        <% for (char a = 'A'; a <= 'Z'; a++) { %>
           <li class="Schnellzugr2"> <a href="#anchor<%= a %>"  class="Schnellzugr3"><%= a %></a> </li>
        <% } %>
</ul>

<a id="ToggleHandicap"> <div class="rollst"></div> </a>

<div class="fl1">                  <!-- -------------- Hand ----------------- -->
    <div class="handl">
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

</div>



<div class="position2">                      <!--  ----------- Button Startseite (pm)-----------   -->
    <asp:LinkButton runat="server" CssClass="start2" Text="" CommandName="Reset" />
</div>