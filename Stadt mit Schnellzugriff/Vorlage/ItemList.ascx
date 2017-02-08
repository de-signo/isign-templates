<%@ Control Language="C#" AutoEventWireup="true" ClassName="ItemList" %>
<%@ Register TagPrefix="iss" Namespace="ISS.Web.UI" Assembly="ISS.Web" %>
<%@ Register Assembly="Stolltec.Forms.Core, Version=3.0.0.0, Culture=neutral, PublicKeyToken=9b480668faf77978"
    Namespace="Stolltec.Forms.Show" TagPrefix="st" %>
<%@ Assembly Name="ISS, Version=4.0.0.0, Culture=neutral, PublicKeyToken=8ea0619067b237be" %>
<%--
  Simple list of items
  
  used by List.ascx and ListABC.ascx
--%>
<script runat="server" language="C#">
    void ItemCommand(object sender, EventArgs ea)
    {
        var cea = ea as CommandEventArgs;
        if (cea != null && cea.CommandName == "Select")
        {
            var arg = String.Format("?__VIEWKEY=details&id={0}", cea.CommandArgument);
            RaiseBubbleEvent(sender, new CommandEventArgs("SelectView", arg));
        }
    }
    
    public string DataSourceID {
	get { EnsureChildControls(); return listRep.DataSourceID; }
	set { EnsureChildControls(); listRep.DataSourceID = value; }
    }
</script>

<asp:Repeater ID="listRep" runat="server" OnItemCommand="ItemCommand">
    <HeaderTemplate>
	<ul>
    </HeaderTemplate>
    <ItemTemplate>
	<li class="item" onclick="this.getElementsByTagName('a')[0].click();">
	    <asp:LinkButton runat="server" ID="lnkSelect" Style="display: none; visibility: collapse;"
		CommandName="Select" />
	    <st:StyleElementProperty runat="server" TargetControlID="lnkSelect"
		PropertyName="CommandArgument" FieldKey="id" />
	    <div class="col1">
		<h2>
		    <st:StyleElementControl runat="server" FieldKey="term1" />
		</h2>
		<h3>
		    <st:StyleElementControl runat="server" FieldKey="term2" />
		</h3>
	    </div>
	    <div class="col2">
			<st:StyleElementControl runat="server" FieldKey="house" />
			<br />
			<st:StyleElementControl runat="server" FieldKey="level" />
			<br />
			<st:StyleElementControl runat="server" FieldKey="entrance" />
	    </div>
	</li>
    </ItemTemplate>
    <FooterTemplate>
	</ul>
    </FooterTemplate>
</asp:Repeater>
