

using System;
using System.Collections;
using System.Linq;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Stolltec.Forms.Show
{

    partial class ItemListBase : UserControl
    {
        public virtual string DataSourceID {get;set;}
    }

    [ParseChildren(true)]
    [PersistChildren(false)]
    public class MyRepeater : Repeater
    {
        public const string GroupDataSourceID = "groupDataSource";


        public string GroupByField
        {
            get { return ViewState["GroupByField"] as string; }
            set { ViewState["GroupByField"] = value; }
        }

        static IStyleControl GetParentStyleControl(Control c)
        {
            var control = c;

            while (control != null && !(control is IStyleControl))
                control = control.Parent;

            return (IStyleControl)control;
        }
        protected override IEnumerable GetData()
        {
            var key = GroupByField;
            if (String.IsNullOrEmpty(key))
                throw new ArgumentNullException("GroupByField");

            var si = GetParentStyleControl(this).StyleInstance;
            var field = si[key].Value as string;

            var baseData = base.GetData();
            if (baseData == null)
                return null;

            // group data
            var grouped = (from x in baseData.Cast<object>()
                           let groupBy = DataBinder.Eval(x, field).ToString().FirstOrDefault()
                           group x by groupBy into y
                           select y).ToArray();
            return grouped;
        }


        protected override void OnItemCreated(RepeaterItemEventArgs e)
        {
            var item = e.Item;
            switch (item.ItemType)
            {
                case ListItemType.AlternatingItem:
                case ListItemType.Item:
                    var data = item.DataItem as IEnumerable; ;
                    item.Controls.Add(new GroupDataSource(data)
                    {
                        ID = GroupDataSourceID,
                    });
                    break;
                default:
                    break;
            }
            base.OnItemCreated(e);
        }

        private class GroupDataSource : DataSourceControl
        {
            private GroupDataSourceView _View;
            private IEnumerable _Data;

            internal GroupDataSource(IEnumerable data)
            {
                _Data = data;
            }
            protected override void OnDataBinding(EventArgs e)
            {
                var data = this.Page.GetDataItem() as IEnumerable;
                if (data == _Data)
                    return;
                _Data = data;
                if (_View != null)
                    _View.DataChanged();
                base.OnDataBinding(e);
            }

            protected override DataSourceView GetView(string viewName)
            {
                if (_View == null)
                    _View = new GroupDataSourceView(this);
                return _View;
            }

            private class GroupDataSourceView : DataSourceView
            {
                readonly GroupDataSource _Owner;
                internal GroupDataSourceView(GroupDataSource owner)
                    : base(owner, "default")
                {
                    _Owner = owner;
                }

                internal void DataChanged()
                {
                    OnDataSourceViewChanged(EventArgs.Empty);
                }
                protected override IEnumerable ExecuteSelect(DataSourceSelectArguments arguments)
                {
                    return _Owner._Data;
                }
            }
        }
    }


    partial class ListABCBase : StyleControlBase
    {
        protected void ItemCommand(object sender, EventArgs ea)
        {
            var cea = ea as CommandEventArgs;
            if (cea != null && cea.CommandName == "Select")
            {
                var arg = String.Format("?__VIEWKEY=details&id={0}", cea.CommandArgument);
                RaiseBubbleEvent(sender, new CommandEventArgs("SelectView", arg));
            }
        }

        protected override void CreateChildControls()
        {
            base.CreateChildControls();


            var rep = new MyRepeater()
            {
                ID = "grpRep",
                DataSourceID = "dsSource",
                GroupByField = "term1",
                ItemTemplate = new CompiledTemplateBuilder((c) =>
                {
                    var li = new HtmlGenericControl("li");
                    c.Controls.Add(li);

                    var a = new Literal();
                    a.DataBinding += (o, e) => {
                        var ctl = (Literal)o;
                        var container = ctl.BindingContainer as IDataItemContainer;
                        var dataItem = container.DataItem as IGrouping<char, object>;
                        var key = dataItem.Key;
                        ctl.Text = String.Format(@"<a id=""anchor{0}"">{0}</a>", key);
                    };
                    li.Controls.Add(a);

                    var list = LoadControl("ItemList.ascx") as ItemListBase;
                    list.ID = "itemList";
                    list.DataSourceID = MyRepeater.GroupDataSourceID;
                    li.Controls.Add(list);
                })
            };
            repeaterPlaceholder.Controls.Add(rep);
        }
    }
}