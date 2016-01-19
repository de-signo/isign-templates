<%@ Control Language="C#" Inherits="Stolltec.Forms.Show.StyleControlBase, Stolltec.Forms.Core, Version=3.0.0.0, Culture=neutral, PublicKeyToken=9b480668faf77978" %>
<%@ Register TagPrefix="iss" Namespace="ISS.Web.UI" Assembly="ISS.Web" %>
<%@ Register Assembly="Stolltec.Forms.Core, Version=3.0.0.0, Culture=neutral, PublicKeyToken=9b480668faf77978"
    Namespace="Stolltec.Forms.Show" TagPrefix="st" %>
<%@ Assembly Name="ISS, Version=4.0.0.0, Culture=neutral, PublicKeyToken=8ea0619067b237be" %>
<%--
  SignDetails.ascx
  
  Style for Stolltec.Forms 3.0. (Information)
  Child style for SignTop.ascx
  German locale
  Detailed view.
  Auto width, scrollable
--%>
<st:StyleDataSource FieldKey="source" runat="server" ID="dsSource">
    <SelectParameters>
        <st:ViewParameter runat="server" FieldKey="id" Name="id" />
    </SelectParameters>
</st:StyleDataSource>
<st:Counter runat="server" Visible="false">
    <st:DisplayIdParameter Name="Display" />
    <asp:Parameter Name="File" DefaultValue="Details.ascx" />
</st:Counter>

<%-- Header --%>
<div class="hd1">
    <h2 runat="server" id="date">
    </h2>
    <h2>
        <span runat="server" id="time"></span>Uhr</h2>
    <st:DateTimeExtender runat="server" ID="dteDate" TargetControlID="date" Format="dddd, dd.MM.yyyy"
        UpdateInterval="60000" />
    <st:DateTimeExtender runat="server" ID="dteTime" TargetControlID="time" Format="HH:mm"
        UpdateInterval="10000" />
</div>
<st:SimpleView runat="server" DataSourceID="dsSource" EmptyDataText="Daten nicht gefunden.">
    <ItemTemplate>
	<div class="hd2">
            <asp:LinkButton runat="server" Text="Startseite" CssClass="start"
                CommandName="Reset" />
            <asp:LinkButton runat="server" Text="Zurück" CssClass="back" CommandName="Back" />
        </div>

        <%-- Body --%>
        <div class="dd1">
         <h1>
                Ihr Suchbereich:
                <st:StyleElementControl ID="StyleElementControl2" runat="server" FieldKey="category" />
            </h1>
            <h2>
                <st:StyleElementControl runat="server" FieldKey="term1" />
            </h2>
            <h3>
                <st:StyleElementControl runat="server" FieldKey="term2" />
            </h3>
             <p class="d1">
                <asp:PlaceHolder runat="server" ID="phHouse">Haus
                    <st:StyleElementControl runat="server" FieldKey="house" />,
                </asp:PlaceHolder>
                <st:StyleElementProperty runat="server" TargetControlID="phHouse" FieldKey="house"
                    PropertyName="Visible" Evaluate="IsNotEmpty" />

                <asp:PlaceHolder runat="server" ID="phLevel">
                    <st:StyleElementControl runat="server" FieldKey="level" />
                </asp:PlaceHolder>
                <st:StyleElementProperty runat="server" TargetControlID="phLevel" FieldKey="level"
                    PropertyName="Visible" Evaluate="IsNotEmpty" />

                <st:StyleElementControl runat="server" FieldKey="entrance" />
		<st:StyleElementControl runat="server" FieldKey="info" />
            </p>
            <p class="d2">
                <asp:PlaceHolder runat="server" ID="litPhone">Fon:
                    <st:StyleElementControl runat="server" FieldKey="phone" />,
                </asp:PlaceHolder>
                <st:StyleElementProperty runat="server" TargetControlID="litPhone" FieldKey="phone"
                    PropertyName="Visible" Evaluate="IsNotEmpty" />
                <asp:PlaceHolder runat="server" ID="litEMail">E-mail:
                    <st:StyleElementControl runat="server" FieldKey="email" />
                </asp:PlaceHolder>
                <st:StyleElementProperty runat="server" TargetControlID="litEMail" FieldKey="email"
                    PropertyName="Visible" Evaluate="IsNotEmpty" />
            </p>
        </div>
        <div class="dd2">
            <st:StyleElementControl runat="server" FieldKey="map" />
        </div>
    </ItemTemplate>
</st:SimpleView>
<%-- Foot --%>
<div class="fd1">
    <div class="handl">
        <img id="circles" runat="server" class="ci" src="circlei2.png" />
        <img id="circlel" runat="server" class="co" src="circleo2.png" />
        <img id="hand" runat="server" class="hand" src="hand2.png" />
        <ajax:animationextender id="AnimationExtender2" runat="server" targetcontrolid="hand">
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
        </ajax:animationextender>
    </div>
    <asp:LinkButton runat="server" CssClass="start" Text="Startseite" CommandName="Reset" />
    <asp:LinkButton runat="server" Text="Zurück" CssClass="back" CommandName="Back" />
</div>

<st:Counter runat="server" Visible="false">
    <st:DisplayIdParameter Name="Display" />
    <asp:Parameter Name="File" DefaultValue="Details.ascx" />
</st:Counter>

