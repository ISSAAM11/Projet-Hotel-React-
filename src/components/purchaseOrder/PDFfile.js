import React from 'react'
import {Page, Text, Image, Document, StyleSheet,View} from '@react-pdf/renderer'
import Mascir from '../../Images/Mascir.jpg'

const styles = StyleSheet.create({

    body: {
        paddingTop: 30,
        paddingBottom: 100,
        paddingHorizontal: 35,
    },
    title: {
        fontSize: 38,
        textAlign: "center",
        color: '#006293'
    },
    text:{
        fontSize: 12,
        paddingBottom: 5,
        flex: 1
    },
    textRight:{
        fontSize: 12,
        paddingBottom: 5,
        textAlign: "right",
    },
    image:{
        width: '40%',
        paddingBottom: 40,

        paddingBottom: 40,

    },
    separation:{
        paddingBottom: 20,
    },
    table: { 
        display: "table", 
        width: "519", 
        borderStyle: "solid", 
        borderWidth: 1, 
        borderRightWidth: 1, 
        borderBottomWidth: 1 ,
      }, 
    tableRow: { 
        margin: "auto", 
        flexDirection: "row" ,
      }, 
    tableRowTitle: { 
      margin: "auto", 
      flexDirection: "row" ,
      backgroundColor: '#00a9ff'

    },
    tableCol: { 
        width: "87", 
        borderStyle: "solid", 
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0 ,
        paddingBottom: 8,
      }, 
    tableCell: { 
        margin: "auto", 
        marginTop: 5, 
        fontSize: 10 
      },
    tableCellTTC: { 
      margin: "auto", 
      marginTop: 5, 
      fontSize: 14,
      color :"#00a9ff"
    },
    tableTitleCell: { 
      margin: "auto", 
      marginTop: 5, 
      fontSize: 10 ,
      color: "white",
      fontWeight: "bold"
    },
    tablefirstCol: { 
        width: "170", 
        borderStyle: "solid", 
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0 ,
        paddingBottom: 8,
      },
    tablefirstCell: { 
        marginTop: 5, 
        fontSize: 10 ,
        paddingLeft : 4
      },
    tableTotal: { 
        display: "table", 
        width: "174", 
        borderWidth: 1, 
        borderRightWidth: 1, 
        borderBottomWidth: 1 ,        

      }, 

    tableTotalPosition: {
    paddingTop: 10,
    paddingLeft: 345,
    },   
    ContactUs: {
        fontSize: 13,
        textAlign: "center",
    }
});

function PDFfile(props) {
    
  return (
    <Document>
        <Page style={styles.body} size="A4" > 
            <Text style={styles.title} fixed> Facture</Text>

            <View style={{display: "flex", flexDirection: "row", paddingTop: 25}}>
                <View style={{flex: 2}} fixed> 
                    <Image style={styles.image} src ={Mascir} className="mt-5"></Image>
                </View>
                <View style={{flex: 1}} fixed> 
                    <Text style={styles.textRight} fixed>{props.purshaiseOrder?.date} </Text>
                    <Text style={styles.textRight}>+212 5 30 27 98 75</Text>
                    <Text style={styles.textRight}>Rue Jazouli – Al Irfane</Text>
                </View>
            </View>


            <View style={{display: "flex", flexDirection: "row", paddingBottom: 25 }}>
                <Text style={{flex: 0.82, backgroundColor: "#00a9ff", color: "white"}} fixed> Adressé à</Text>
                <Text style={{flex: 3}}>&nbsp;</Text>

                <Text style={{flex: 0.76, backgroundColor: "#00a9ff", color: "white"}}>&nbsp; Emetteur &nbsp;</Text>
            </View>

            <View style={{display: "flex", flexDirection: "row",}}>
                <Text style={styles.text} fixed> {props.purshaiseOrder?.hotel?.admin_name}</Text>
                <Text style={styles.textRight}>MAScIR</Text>
            </View>
            <View style={{display: "flex", flexDirection: "row",}}>
                <Text style={styles.text} fixed> {props.purshaiseOrder?.hotel?.adress}</Text>
                <Text style={styles.textRight}>+212 5 30 27 98 75</Text>
            </View>
            <View style={{display: "flex", flexDirection: "row",}}>
                <Text style={styles.text} fixed> {props.purshaiseOrder?.hotel?.country},&nbsp;{props.purshaiseOrder?.hotel?.Region}</Text>
                <Text style={styles.textRight}>Maroc, Rabat </Text>
            </View>
            <View style={{display: "flex", flexDirection: "row",}}>
                <Text style={styles.text} fixed> {props.purshaiseOrder?.hotel?.account}</Text>
                <Text style={styles.textRight}>contact@mascir.com </Text>
            </View>
            <View style={{display: "flex", flexDirection: "row",}}>
                <Text style={styles.text} fixed> {props.purshaiseOrder?.hotel?.phone}</Text>
                <Text style={styles.textRight} fixed> Rue Jazouli – Al Irfane </Text>
            </View>
            <Text style={styles.separation} fixed>&nbsp; </Text>            
    
    <View style={styles.table}> 
        <View style={styles.tableRowTitle } > 
          <View style={styles.tablefirstCol}> 
            <Text style={styles.tableTitleCell}>Description</Text> 
          </View> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableTitleCell}>Prix unitaire</Text> 
          </View> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableTitleCell}>Quantité</Text> 
          </View> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableTitleCell}>TVA (%)	</Text> 
          </View> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableTitleCell}>Total HT </Text> 
          </View> 
        </View>

        {props.purshaiseOrder?.ProductList?.map((post,index) => (
        <View style={styles.tableRow} key={post.id}> 
          <View style={styles.tablefirstCol}> 
            <Text style={styles.tablefirstCell}>{post.name}&nbsp;{post.category}</Text> 
          </View> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>{post.prix}	</Text> 
          </View> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>{post.amount}	</Text> 
          </View> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>{post.TVA}	</Text> 
          </View> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>{post.prix * post.amount}	</Text> 
          </View> 
        </View>
        ))} 
    </View>



    <View style={styles.tableTotalPosition}>
        <View style={styles.tableTotal}> 
            <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>Total HT</Text> 
            </View> 
            <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{props.purshaiseOrder?.totalHT} DT</Text> 
            </View> 
            </View>

            <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>Total TVA</Text> 
            </View> 
            <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{props.purshaiseOrder?.totalTVA} DT</Text> 
            </View> 
            </View>

            <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
                <Text style={styles.tableCellTTC}>Total TTC</Text> 
            </View> 
            <View style={styles.tableCol}> 
                <Text style={styles.tableCellTTC}>{props.purshaiseOrder?.totalTTC} DT</Text> 
            </View> 
            </View>
        </View>
    </View>
    <Text style={styles.separation} fixed>&nbsp; </Text>            


    <Text style={styles.ContactUs} fixed> Si vous avez des questions sur cette facture, </Text>
    <Text style={styles.ContactUs} fixed> veuillez nous contacter </Text>

        </Page>
    </Document>  
)}

export default PDFfile