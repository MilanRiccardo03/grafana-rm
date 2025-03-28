//
// Code generated by grafana-app-sdk. DO NOT EDIT.
//

package v0alpha1

import (
	"github.com/grafana/grafana-app-sdk/resource"
)

// schema is unexported to prevent accidental overwrites
var (
	schemaInvestigationIndex = resource.NewSimpleSchema("investigations.grafana.app", "v0alpha1", &InvestigationIndex{}, &InvestigationIndexList{}, resource.WithKind("InvestigationIndex"),
		resource.WithPlural("investigationindexes"), resource.WithScope(resource.NamespacedScope))
	kindInvestigationIndex = resource.Kind{
		Schema: schemaInvestigationIndex,
		Codecs: map[resource.KindEncoding]resource.Codec{
			resource.KindEncodingJSON: &InvestigationIndexJSONCodec{},
		},
	}
)

// Kind returns a resource.Kind for this Schema with a JSON codec
func InvestigationIndexKind() resource.Kind {
	return kindInvestigationIndex
}

// Schema returns a resource.SimpleSchema representation of InvestigationIndex
func InvestigationIndexSchema() *resource.SimpleSchema {
	return schemaInvestigationIndex
}

// Interface compliance checks
var _ resource.Schema = kindInvestigationIndex
