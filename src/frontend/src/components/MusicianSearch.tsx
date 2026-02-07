import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, MapPin, Star, Music } from 'lucide-react';
import type { UserProfile } from '../backend';

interface MusicianSearchProps {
  musicians: UserProfile[];
  onBookMusician: (musician: UserProfile) => void;
}

export default function MusicianSearch({ musicians, onBookMusician }: MusicianSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMusicians = musicians.filter(
    (musician) =>
      musician.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      musician.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      musician.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Find Musicians</CardTitle>
        <CardDescription>Search and book talented musicians for your venue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, location, or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-12 bg-background/50 backdrop-blur-sm border-border/50"
          />
        </div>

        {filteredMusicians.length === 0 ? (
          <div className="text-center py-12">
            <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">No musicians found</p>
            <p className="text-muted-foreground mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredMusicians.map((musician) => (
              <Card key={musician.id.toString()} className="border-border/50 bg-background/50 hover:border-chart-1/50 transition-all">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-chart-1">
                      <AvatarFallback className="bg-chart-1/20 text-chart-1 font-semibold text-xl">
                        {getInitials(musician.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{musician.name}</CardTitle>
                      <CardDescription className="flex flex-col gap-1">
                        <span className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {musician.location}
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="h-3 w-3 fill-chart-2 text-chart-2" />
                          {musician.rating > 0 ? musician.rating.toFixed(1) : 'New'}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {musician.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{musician.bio}</p>
                  )}
                  <Button
                    onClick={() => onBookMusician(musician)}
                    className="w-full bg-chart-1 hover:bg-chart-1/90"
                  >
                    Book Musician
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
