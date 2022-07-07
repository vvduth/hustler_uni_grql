import { type } from "os";
import {
  graphql,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
  GraphQLUnionType,
} from "graphql";
import { resolve } from "path";
import axios from "axios";

const RocketType = new GraphQLObjectType({
    name: 'Rocket',
    fields: () => ({
       rocket_id : {type: GraphQLInt},
       rocket_name:  {type: GraphQLString},
       rocket_type : {type: GraphQLString}
    })
})



const LaunchType = new GraphQLObjectType({
    name: 'Launch',
    fields: () => ({
        flight_number : {
            type: GraphQLInt
        },
        mission_name : {
            type: GraphQLString
        },
        launch_year : {
            type: GraphQLInt
        },
        launch_date_local : {
            type: GraphQLString
        },
        launch_success : {
            type: GraphQLBoolean
        },
        rocket : {
            type: RocketType
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        launches: {
            type: new GraphQLList(LaunchType),
            resolve(parent, args) {
                return axios.get('')
            }
        }
    }
})