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

<!--  <div class="lm1">
</div>  -->

<%-- Header --%>
                                                              <!--  ---- Datum u. Uhrzeit ----   -->

<div class="Ueberschrift">Suchen & Finden</div>               <!--  ---- Überschrift ----   -->

<div>
    <img runat="server" class="Img1" alt="header" src="header1.jpg" />              <!--  ---- Headerbild ----   -->
</div>

<%-- Data --%>

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

    <% if ((string)StyleInstance["options"].Value == "search") { %>                     <!-- -------------- Suchfeld ----------------- -->
          <div class="Suchfeld">
              <asp:LinkButton runat="server" ID="lnkSearch" CommandName="SelectView" CommandArgument="?__VIEWKEY=search">
                <div class="Suchfeld2">
                    <span class="Suchfeld3"> Suchen &nbsp;&nbsp;&nbsp;</span>
                    <img runat="server" class="Img2" alt="Suche" src="Lupe.png" />
                </div>
              </asp:LinkButton>
          </div>

    <% } else { %>
        <!-- Search disabled -->
    <% } %>


  <div class="handm">                                      <!-- -------------- Hand ----------------- -->
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