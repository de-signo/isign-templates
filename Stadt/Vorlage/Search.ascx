<%@ Control Language="c#" AutoEventWireup="false" Inherits="Stolltec.Forms.Show.StyleControlBase, Stolltec.Forms.Core, Version=3.0.0.0, Culture=neutral, PublicKeyToken=9b480668faf77978"
    TargetSchema="http://schemas.microsoft.com/intellisense/ie5" %>
<%@ Register Assembly="Stolltec.Forms.Core, Version=3.0.0.0, Culture=neutral, PublicKeyToken=9b480668faf77978"
    Namespace="Stolltec.Forms.Show" TagPrefix="st" %>

<script runat="server" language="C#">
    protected override void OnPreRender(EventArgs e)
    {
        base.OnPreRender(e);

        ScriptManager.RegisterStartupScript(this, this.GetType(), "dataBindings",
            @"dataBindings = [
                { source: '" + cdsSource.ClientID + "', target: '" + dataView.ClientID + @"' }
            ];", true);

        var sm = ScriptManager.GetCurrent(Page);
        sm.RegisterAsyncPostBackControl(this);
        ScriptManager.RegisterStartupScript(this, this.GetType(), "handleSelect",
            @"function handleSelect(el) {
                var id = el.getElementsByTagName('input')[0];
                var ref = """ + Page.ClientScript.GetPostBackEventReference(this, "SelectView$?__VIEWKEY=details&id={0}", true) + @""";
                ref = String.format(ref, id.value);
                eval(ref);
            };", true);

        // reset find string
        txtFind.Text = "";
    }
</script>


<st:Counter runat="server" Visible="false">
    <st:DisplayIdParameter Name="Display" />
    <asp:Parameter Name="File" DefaultValue="Search.ascx" />
</st:Counter>

<%-- Data sources --%>
<st:SearchResultDataSource FieldKey="source" runat="server" ID="dsSource">
    <SelectParameters>
        <asp:Parameter Name="ResultCount" DefaultValue="6" Type="Int32" />
        <asp:Parameter Name="Threshold" DefaultValue="<%$ Code: 0.3.ToString() %>" Type="Double" />
        <asp:Parameter Name="ExactMatch" DefaultValue="false" Type="Boolean" />
    </SelectParameters>
</st:SearchResultDataSource>
<st:ClientDataSource runat="server" ID="cdsSource" DataSourceID="dsSource" DataSourceParameterProperty="SelectParameters"
    EnableCallback="true">
    <ClientParameters>
        <iss:clientparameter name="FindString" type="String" />
    </ClientParameters>
</st:ClientDataSource>


<%-- Header --%>
<div class="hl1">                                             <!--  ----- Datum u. Uhrzeit -----   -->
    <h2 runat="server" id="date" class="datum2"></h2>
    <h2><span runat="server" id="time" class="zeit2"></span> Uhr</h2>
    <st:DateTimeExtender runat="server" ID="dteDate" TargetControlID="date" Format="dddd, dd.MM.yyyy" UpdateInterval="60000" />       <!--  ori: 60000 ----   -->
    <st:DateTimeExtender runat="server" ID="dteTime" TargetControlID="time" Format="HH:mm" UpdateInterval="10000" />         <!--  ori: 10000 ----   -->
</div>


<div class="hl2">                      <!--  ----------- Button Startseite (pm)-----------   -->
    <asp:LinkButton runat="server" CssClass="start start_Search" Text="Startseite" CommandName="Reset" />
</div>



<%-- Data --%>
 <div class="search_box">                                 <!--  ----------- Suchbox -----------   -->

    <div class="search_box2">
       <asp:TextBox runat="server" ID="txtFind" />
    </div>
        <st:FindBoxExtender runat="server" TargetControlID="txtFind" ClientDataSourceID="cdsSource" />

</div>



<%-- -------------------- Tastatur ------------------------ --%>
<div class="userinput">


    <%-- Keyboard --%>
    <!--  ----------- Zahlenreihe -----------   -->
    <div class="userinput1">
         <st:Keyboard runat="server" TextBoxID="txtFind" CssClass="keyboard" Characters="1234567890" />
    </div>

    <%
    var opt = (string)StyleInstance["options"].Value;
    switch (opt)
    {
        case "abc":
             %>

    <!--  ----------- ABC Version -----------   -->
    <div class="userinput2">
           <st:Keyboard runat="server" TextBoxID="txtFind" CssClass="keyboard" Characters="ABCDEFGHIJ" />
           <st:Keyboard runat="server" TextBoxID="txtFind" CssClass="keyboard" Characters="KLMNOPQRST" />
           <st:Keyboard runat="server" TextBoxID="txtFind" CssClass="keyboard" Characters="UVWXYZÄÖÜß" />
    </div>

        <%  break;
        case "qwertz":
        default:
            %>
    <!--  ----------- Qwertz Version -----------   -->
    <div class="userinput3">
          <st:Keyboard runat="server" TextBoxID="txtFind" CssClass="keyboard3" Characters="QWERTZUIOPÜ" />
          <st:Keyboard runat="server" TextBoxID="txtFind" CssClass="keyboard3" Characters="ASDFGHJKLÖÄ" />
          <st:Keyboard runat="server" TextBoxID="txtFind" CssClass="keyboard3" Characters="YXCVBNM" />
    </div>

        <%  break;
    } %>

    <!--  ----------- Tastereihe 5 unten -----------   -->
    <div class="userinput5">
           <st:Keyboard runat="server" TextBoxID="txtFind" CssClass="keyboard" Characters="- &#13;">
               <ButtonStyles>
                   <st:ButtonStyle Character=" " CssClass="key_space" />
                   <st:ButtonStyle Character="&#13;" CssClass="key_del" Text="Entf" />
               </ButtonStyles>
           </st:Keyboard>
    </div>

</div>


<div class="resultspace">                                  <!--  ----------- Ergebnisanzeige -----------   -->
    <iss:dataviewi runat="server" id="dataView" autofetch="true" cssclass="results">
       <LayoutTemplate>
            <div runat="server" id="itemPlaceholder" />       <!-- ---temp: Platzhalter resultspace (hier: id=itemPlaceholder) ---   -->
       </LayoutTemplate>
       <ItemTemplate>
        <div runat="server" id="itemTemplate">

        <div onclick="handleSelect(this)">
            <input type="hidden" sys:value="{{_KEY}}" />
            <div>
                <span>{binding <%= StyleInstance["name"].Value %>, convert=nullToEmpty}</span>
            </div>
        </div>
        </div>
       </ItemTemplate>
    </iss:dataviewi>

</div>
