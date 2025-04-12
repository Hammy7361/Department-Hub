"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Download, PlusCircle, FolderPlus } from "lucide-react"
import { mockResourcesData } from "@/lib/mock-data"

export default function ResourcesPage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Get user role
    const role = localStorage.getItem("userRole")
    setUserRole(role)
    setIsLoading(false)
  }, [router])

  const filteredResources = mockResourcesData.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Department Resources</h1>
            <p className="text-muted-foreground">Access important documents and department information</p>
          </div>
          <div className="flex items-center gap-2">
            {userRole === "manager" && (
              <Button onClick={() => router.push("/resources/upload")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Upload Resource
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[240px_1fr]">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted px-2 rounded-md">
                  <span>All Resources</span>
                  <Badge>{mockResourcesData.length}</Badge>
                </div>
                <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted px-2 rounded-md">
                  <span>Policies</span>
                  <Badge>{mockResourcesData.filter((r) => r.category === "Policy").length}</Badge>
                </div>
                <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted px-2 rounded-md">
                  <span>Forms</span>
                  <Badge>{mockResourcesData.filter((r) => r.category === "Form").length}</Badge>
                </div>
                <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted px-2 rounded-md">
                  <span>Training</span>
                  <Badge>{mockResourcesData.filter((r) => r.category === "Training").length}</Badge>
                </div>
                <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted px-2 rounded-md">
                  <span>Announcements</span>
                  <Badge>{mockResourcesData.filter((r) => r.category === "Announcement").length}</Badge>
                </div>
                {userRole === "manager" && (
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    <FolderPlus className="mr-2 h-4 w-4" />
                    New Category
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Resources</CardTitle>
                  <CardDescription>Browse and access department resources</CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search resources..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="space-y-4">
                    {filteredResources.length > 0 ? (
                      filteredResources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-md">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{resource.title}</h3>
                              <p className="text-sm text-muted-foreground">{resource.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{resource.category}</Badge>
                                <span className="text-xs text-muted-foreground">Updated {resource.updatedAt}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No resources found matching your search
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="recent" className="space-y-4">
                    {filteredResources
                      .filter((resource) => resource.isRecent)
                      .map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-md">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{resource.title}</h3>
                              <p className="text-sm text-muted-foreground">{resource.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{resource.category}</Badge>
                                <span className="text-xs text-muted-foreground">Updated {resource.updatedAt}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      ))}
                  </TabsContent>
                  <TabsContent value="favorites" className="space-y-4">
                    {filteredResources
                      .filter((resource) => resource.isFavorite)
                      .map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-md">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{resource.title}</h3>
                              <p className="text-sm text-muted-foreground">{resource.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{resource.category}</Badge>
                                <span className="text-xs text-muted-foreground">Updated {resource.updatedAt}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
